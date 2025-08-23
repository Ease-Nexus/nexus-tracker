import { Injectable } from '@nestjs/common';
import { TimerSchedulerService } from 'src/core/infrastructure';
import { DrizzleTimerRepository } from 'src/shared/database';

@Injectable()
export class PauseTimerUseCase {
  constructor(
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
