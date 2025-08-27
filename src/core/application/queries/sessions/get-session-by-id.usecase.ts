import { Injectable } from '@nestjs/common';
import { SessionNotFoundException, TenantNotFoundException } from 'src/core/domain';
import { DrizzleSessionRepository, DrizzleTenantRepository } from 'src/shared';

@Injectable()
export class GetSessionByIdUsecase {
  constructor(
    private readonly tenantRepository: DrizzleTenantRepository,
    private readonly sessionRepository: DrizzleSessionRepository,
  ) {}

  async getSession(tenantCode: string, sessionId: string) {
    const tenant = await this.tenantRepository.getByCode(tenantCode);

    if (!tenant) throw new TenantNotFoundException();

    const session = await this.sessionRepository.getById({
      tenantId: tenant.id,
      id: sessionId,
    });

    if (!session) {
      throw new SessionNotFoundException();
    }

    return session;
  }
}
