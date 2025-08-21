import { Inject, Injectable } from '@nestjs/common';
import { TimerSchedulerService } from 'src/modules/timers/infrastructure';
import { databaseSymbols, DrizzleTimerRepository } from 'src/shared';

@Injectable()
export class PauseTimerUseCase {
  constructor(
    @Inject(databaseSymbols.timerRepository)
    private readonly timerRepository: DrizzleTimerRepository,
    private readonly timerSchedulerService: TimerSchedulerService,
  ) {}

  async pauseTimer(id: string) {
    const timer = await this.timerRepository.getById(id);

    timer.pause();

    await this.timerRepository.update(timer);
    this.timerSchedulerService.pauseTimer(timer);
  }
}
