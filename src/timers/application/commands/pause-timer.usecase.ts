import { Inject, Injectable } from '@nestjs/common';
import {
  DrizzleTimerRepository,
  InfraSymbols,
  TimerSchedulerService,
} from 'src/timers/infrastructure';

@Injectable()
export class PauseTimerUseCase {
  constructor(
    @Inject(InfraSymbols.timerRepository)
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
