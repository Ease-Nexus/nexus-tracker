import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { Timer } from '../domain';
import { TimerGateway } from './timer.gateway';
import { DrizzleTimerRepository } from 'src/shared/database';
import { EndSessionUsecase } from '../application/commands/sessions/end-session.usecase';

const TICK_MS = 500; // frequência de cálculo/WS
const FLUSH_MS = 500; // frequência mínima de persistência

@Injectable()
export class TimerSchedulerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TimerSchedulerService.name);

  private running = new Map<string, Timer>();

  private lastFlushedAt = new Map<string, number>();

  private loop?: NodeJS.Timeout;

  constructor(
    private readonly timerRepository: DrizzleTimerRepository,
    private readonly ws: TimerGateway,
    private readonly endSessionUseCase: EndSessionUsecase,
  ) {}

  // Considera bloco aberto (RUNNING) para medir elapsed “ao vivo”

  private async tick() {
    if (this.running.size === 0) return;

    const now = new Date();
    const toFlush: Timer[] = [];

    for (const t of this.running.values()) {
      // Se passou do tempo -> finalizar agora (negativa se necessário)

      t.updateLive(now);

      if (t.isCompleted()) {
        t.complete(); // fecha bloco + complete()
        toFlush.push(t);
        this.running.delete(t.id);
        this.ws.completed(t);

        if (t.session) {
          await this.endSessionUseCase.end({
            id: t.session?.id,
            tenantId: t.tenantId,
          });
        }

        continue;
      }

      // Emite atualização para o front
      this.ws.tick(t);

      // Persistência periódica (mesmo sem mudança de campos “visíveis”):
      // isso garante durabilidade de um bloco aberto (já que o start do bloco foi salvo).
      const last = this.lastFlushedAt.get(t.id) ?? 0;
      if (now.getTime() - last >= FLUSH_MS) {
        // Opcional: atualizar apenas campos voláteis
        // Aqui salvamos o estado atual para “forçar” o heartbeat persistido.
        toFlush.push(t);
        this.lastFlushedAt.set(t.id, now.getTime());
      }
    }

    if (toFlush.length) {
      await this.timerRepository.bulkUpdate(toFlush);
    }
  }

  async onModuleInit() {
    const recovering = await this.timerRepository.getByStatus('RUNNING');

    for (const timer of recovering) {
      if (timer.isCompleted()) {
        timer.complete();

        if (timer.session) {
          await this.endSessionUseCase.end({
            id: timer.session?.id,
            tenantId: timer.tenantId,
          });
        }

        await this.timerRepository.update(timer);
        this.ws.completed(timer);
      } else {
        this.running.set(timer.id, timer);
        this.ws.resumed(timer);
      }

      this.lastFlushedAt.set(timer.id, Date.now());
    }

    this.loop = setInterval(() => void this.tick(), TICK_MS);
    this.logger.log(`Timer loop started: tick=${TICK_MS}ms flush>=${FLUSH_MS}ms`);
  }

  onModuleDestroy() {
    if (this.loop) clearInterval(this.loop);
    this.logger.log('Timer loop stopped');
  }

  startTimer(timer: Timer) {
    this.running.set(timer.id, timer);
    this.lastFlushedAt.set(timer.id, Date.now());
    this.ws.started(timer);
  }

  pauseTimer(timer: Timer) {
    this.running.delete(timer.id);
    this.ws.paused(timer);
  }
}
