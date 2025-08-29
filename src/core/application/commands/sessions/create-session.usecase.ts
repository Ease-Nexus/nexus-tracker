import { Injectable } from '@nestjs/common';

import {
  DrizzleBadgeRepository,
  DrizzleSessionRepository,
  DrizzleTenantRepository,
} from 'src/shared/database/repositories';
import {
  BadgeNotFoundException,
  Session,
  StartSessionDto,
  TenantNotFoundException,
  UnavailableBadgeException,
} from '../../../domain';
import { CreateTimerUseCase } from '../timers/create-timer.usecase';

@Injectable()
export class CreateSessionUsecase {
  constructor(
    private readonly tenantRepository: DrizzleTenantRepository,
    private readonly badgeRepository: DrizzleBadgeRepository,
    private readonly sessionRepository: DrizzleSessionRepository,
    private readonly createTimerUseCase: CreateTimerUseCase,
  ) {}

  async create(
    tenantCode: string,
    { customerId, badgeValue, duration, startImmediately }: StartSessionDto,
  ) {
    const tenant = await this.tenantRepository.getByCode(tenantCode);

    if (!tenant) {
      throw new TenantNotFoundException();
    }

    // Fetch badge by value
    const badge = await this.badgeRepository.getByValue(tenant.id, badgeValue);

    if (!badge) {
      throw new BadgeNotFoundException();
    }

    // Validate badge availability
    if (badge.inUse()) {
      throw new UnavailableBadgeException();
    }

    // Create session entity
    const session = Session.create({
      tenantId: badge.tenantId,
      tenant,
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
