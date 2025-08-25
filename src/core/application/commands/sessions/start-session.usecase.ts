import { Injectable } from '@nestjs/common';

import {
  DrizzleBadgeRepository,
  DrizzleSessionRepository,
} from 'src/shared/database/repositories';
import {
  BadgeNotFoundException,
  Session,
  StartSessionDto,
  UnavailableBadgeException,
} from '../../../domain';
import { CreateTimerUseCase } from '../timers/create-timer.usecase';

@Injectable()
export class StartSessionUsecase {
  constructor(
    private readonly badgeRepository: DrizzleBadgeRepository,
    private readonly sessionRepository: DrizzleSessionRepository,
    private readonly createTimerUseCase: CreateTimerUseCase,
  ) {}

  async start(
    tenantCode: string,
    {
      customerId,
      badge: badgeValue,
      duration,
      startImmediately,
    }: StartSessionDto,
  ) {
    // Fetch badge by value
    const badge = await this.badgeRepository.getByValue(badgeValue);

    if (!badge) {
      throw new BadgeNotFoundException();
    }

    // Validate badge availability
    if (badge.inUse()) {
      throw new UnavailableBadgeException();
    }

    // Create session entity
    const session = Session.create({
      tenantCode,
      customerId,
      badgeId: badge.id,
      badge,
      startedAt: new Date(),
    });

    // Save session to repository
    await this.sessionRepository.create(session);

    // Create timer for the session
    await this.createTimerUseCase.create(session, duration, startImmediately);
    // Return session details
  }
}
