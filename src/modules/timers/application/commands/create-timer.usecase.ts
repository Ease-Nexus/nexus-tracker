import { Inject, Injectable } from '@nestjs/common';
import { Timer } from 'src/modules/timers';
import { Session } from 'src/modules/management';
import { UnavailableBadgeException } from 'src/modules/timers/domain/exceptions';
import { TimerSchedulerService } from 'src/modules/timers/infrastructure';
import { databaseSymbols, DrizzleTimerRepository } from 'src/shared';

@Injectable()
export class CreateTimerUseCase {
  constructor(
    @Inject(databaseSymbols.timerRepository)
    private readonly timerRepository: DrizzleTimerRepository,
    private readonly timerSchedulerService: TimerSchedulerService,
  ) {}

  async create(
    session: Session,
    durationMinutes: number,
    startImmediately?: boolean,
  ) {
    const activeTimers = await this.timerRepository.getByStatus([
      'RUNNING',
      'PAUSED',
      'CREATED',
    ]);

    if (activeTimers.find((t) => t.session?.badgeId === session.badge?.id)) {
      throw new UnavailableBadgeException();
    }

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
