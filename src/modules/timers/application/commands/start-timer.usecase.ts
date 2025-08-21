import { Inject, Injectable } from '@nestjs/common';
import { TimerSchedulerService } from 'src/modules/timers/infrastructure';
import { databaseSymbols, DrizzleTimerRepository } from 'src/shared';

@Injectable()
export class StartTimerUseCase {
  constructor(
    @Inject(databaseSymbols.timerRepository)
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
