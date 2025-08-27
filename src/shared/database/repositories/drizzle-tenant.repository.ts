import { Inject, Injectable } from '@nestjs/common';
import { DRIZLE_DB, tenantsTable, type DrizzleDatabase } from '../drizzle-setup';
import { eq } from 'drizzle-orm';
import { TenantMapper } from './mappers';

@Injectable()
export class DrizzleTenantRepository {
  constructor(
    @Inject(DRIZLE_DB)
    private readonly db: DrizzleDatabase,
  ) {}

  async getByCode(tenantCode: string) {
    const result = await this.db.select().from(tenantsTable).where(eq(tenantsTable.code, tenantCode));

    if (result.length === 0) {
      return undefined;
    }

    const [tenant] = result;

    return TenantMapper.toDomain({ tenant });
  }
}
