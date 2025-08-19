import { Inject, Injectable } from '@nestjs/common';
import {
  DrizzleTimerRepository,
  InfraSymbols,
  TimerSchedulerService,
} from 'src/timers/infrastructure';

@Injectable()
export class StartTimerUseCase {
  constructor(
    @Inject(InfraSymbols.timerRepository)
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
