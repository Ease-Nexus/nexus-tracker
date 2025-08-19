import { Inject, Injectable } from '@nestjs/common';
import { Timer } from 'src/timers/domain';
import {
  BadgeNotFoundException,
  UnavailableBadgeException,
} from 'src/timers/domain/exceptions';
import {
  DrizzleBadgeRepository,
  DrizzleTimerRepository,
  InfraSymbols,
  TimerSchedulerService,
} from 'src/timers/infrastructure';

@Injectable()
export class CreateTimerUseCase {
  constructor(
    @Inject(InfraSymbols.timerRepository)
    private readonly timerRepository: DrizzleTimerRepository,
    @Inject(InfraSymbols.badgeRepository)
    private readonly badgeRepository: DrizzleBadgeRepository,
    private readonly timerSchedulerService: TimerSchedulerService,
  ) {}

  async create(
    badgeValue: string,
    durationMinutes: number,
    startImmediately?: boolean,
  ) {
    const badge = await this.badgeRepository.getByValue(badgeValue);

    if (!badge) {
      throw new BadgeNotFoundException();
    }

    const activeTimers = await this.timerRepository.getByStatus([
      'RUNNING',
      'PAUSED',
      'CREATED',
    ]);

    if (activeTimers.find((t) => t.badgeId === badge.id)) {
      throw new UnavailableBadgeException();
    }

    const timer = Timer.createNew(badge, durationMinutes);

    if (startImmediately) {
      timer.start();
    }

    await this.timerRepository.create(timer);

    if (startImmediately) {
      this.timerSchedulerService.startTimer(timer);
    }
  }
}
