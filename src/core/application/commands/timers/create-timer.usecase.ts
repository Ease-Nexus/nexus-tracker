import { Injectable } from '@nestjs/common';
import { Session, Timer } from 'src/core/domain';

import { DrizzleTimerRepository } from 'src/shared/database';
import { TimerSchedulerService } from 'src/core/infrastructure';

@Injectable()
export class CreateTimerUseCase {
  constructor(
    private readonly timerRepository: DrizzleTimerRepository,
    private readonly timerSchedulerService: TimerSchedulerService,
  ) {}

  async create(session: Session, durationMinutes: number, startImmediately?: boolean) {
    const timer = Timer.createNew(session, durationMinutes);

    if (startImmediately) {
      timer.start();
    }

    await this.timerRepository.create(timer);

    if (startImmediately) {
      this.timerSchedulerService.startTimer(timer);
    }
  }
}
