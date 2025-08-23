import { Injectable } from '@nestjs/common';
import { TimerSchedulerService } from 'src/core/infrastructure';
import { DrizzleTimerRepository } from 'src/shared/database';

@Injectable()
export class StartTimerUseCase {
  constructor(
    private readonly timerRepository: DrizzleTimerRepository,
    private readonly timerSchedulerService: TimerSchedulerService,
  ) {}

  async startTimer(timerId: string) {
    const timer = await this.timerRepository.getById(timerId);

    timer.start();

    await this.timerRepository.update(timer);

    this.timerSchedulerService.startTimer(timer);
  }
}
