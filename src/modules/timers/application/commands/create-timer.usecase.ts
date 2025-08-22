import { Injectable } from '@nestjs/common';
import { Timer } from '../../domain';
import { Session } from 'src/modules/management/domain';

import { TimerSchedulerService } from 'src/modules/timers/infrastructure';
import { DrizzleTimerRepository } from 'src/shared/database';

@Injectable()
export class CreateTimerUseCase {
  constructor(
    private readonly timerRepository: DrizzleTimerRepository,
    private readonly timerSchedulerService: TimerSchedulerService,
  ) {}

  async create(
    session: Session,
    durationMinutes: number,
    startImmediately?: boolean,
  ) {
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
