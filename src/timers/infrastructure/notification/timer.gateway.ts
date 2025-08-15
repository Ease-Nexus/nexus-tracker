import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Timer } from 'src/timers/domain';

@WebSocketGateway({
  namespace: '/timers',
  cors: { origin: '*' },
})
export class TimerGateway {
  @WebSocketServer()
  server: Server;

  buildLiveDto(timer: Timer) {
    const overDue = Math.max(timer.elapsed - timer.duration, 0);

    const dto = {
      id: timer.id,
      badgeId: timer.badgeId,
      status: timer.status,
      duration: timer.duration,
      elapsed: timer.elapsed,
      remainingMs: timer.remaining,
      overDueMs: overDue,
      startedAt: timer.startedAt?.toISOString(),
      lastStartedAt: timer.lastStartedAt?.toISOString(),
      history: timer.history.map((historyItem) => ({
        start: historyItem.start.toISOString(),
        end: historyItem.end ? historyItem.end?.toISOString() : undefined,
        elapsed: historyItem.elapsed,
      })),
    };

    return dto;
  }

  emitEvent(event: string, timer: Timer) {
    this.server.emit(event, this.buildLiveDto(timer));
  }

  started(timer: Timer) {
    this.emitEvent('timer.started', timer);
  }

  paused(timer: Timer) {
    this.emitEvent('timer.paused', timer);
  }

  completed(timer: Timer) {
    this.emitEvent('timer.completed', timer);
  }

  tick(timer: Timer) {
    this.emitEvent('timer.tick', timer);
  }
  resumed(timer: Timer) {
    this.emitEvent('timer.resumed', timer);
  }
}
