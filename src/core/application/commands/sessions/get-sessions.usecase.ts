import { Injectable } from '@nestjs/common';
import { TenantNotFoundException } from 'src/core/domain';
import {
  DrizzleSessionRepository,
  DrizzleTenantRepository,
} from 'src/shared/database';

@Injectable()
export class GetSessionsUseCase {
  constructor(
    private readonly tenantRepository: DrizzleTenantRepository,
    private readonly sessionRepository: DrizzleSessionRepository,
  ) {}

  async getSessions(tenantCode: string, isOpen?: boolean) {
    const tenant = await this.tenantRepository.getByCode(tenantCode);

    if (!tenant) {
      throw new TenantNotFoundException();
    }

    return await this.sessionRepository.getAll({
      tenantId: tenant.id,
      isOpen: isOpen ?? true,
    });
  }
}
