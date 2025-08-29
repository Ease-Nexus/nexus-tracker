import { Injectable } from '@nestjs/common';
import {
  SessionHasActiveTimerException,
  SessionNotFoundException,
  SessionsEndParams,
  Tenant,
  TenantNotFoundException,
} from 'src/core/domain';
import {
  DrizzleSessionRepository,
  DrizzleTenantRepository,
} from 'src/shared/database';
import { CompleteTimerUsecase } from '../timers/complete-timer.usecase';

@Injectable()
export class EndSessionUsecase {
  constructor(
    private readonly tenantRepository: DrizzleTenantRepository,
    private readonly sessionRepository: DrizzleSessionRepository,
    private readonly completeTimerUseCase: CompleteTimerUsecase,
  ) {}

  private async validateTenant({
    tenantCode,
    tenant,
  }: SessionsEndParams): Promise<Tenant> {
    if (tenant) return tenant;

    const tenantResult = await this.tenantRepository.getByCode(tenantCode);

    if (!tenantResult) {
      throw new TenantNotFoundException();
    }

    return tenantResult;
  }

  async end(params: SessionsEndParams) {
    const tenant = await this.validateTenant(params);

    const { id, forceCompleteTimer } = params;

    const session = await this.sessionRepository.getById({
      tenantId: tenant.id,
      id,
    });

    if (!session) {
      throw new SessionNotFoundException();
    }

    if (session.timer && !session.timer.isCompleted() && forceCompleteTimer) {
      await this.completeTimerUseCase.complete({
        tenant,
        tenantCode: tenant.code,
        timerId: session.timer.id,
      });
    }

    if (!session.timer?.isCompleted()) {
      throw new SessionHasActiveTimerException();
    }

    session.end();

    await this.sessionRepository.update(session);
  }
}
