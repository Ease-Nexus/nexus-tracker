import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import type { DrizzleDatabase } from '../drizzle-setup';
import { badgesTable, tenantsTable } from '../drizzle-setup/schema';
import { BadgeMapper } from './mappers';
import { databaseSymbols } from '../database-symbols';
import { Badge } from 'src/modules/management';

@Injectable()
export class DrizzleBadgeRepository {
  constructor(
    @Inject(databaseSymbols.DRIZLE_DB) private readonly db: DrizzleDatabase,
  ) {}

  async getByValue(value: string): Promise<Badge | undefined> {
    const [row] = await this.db
      .select()
      .from(badgesTable)
      .innerJoin(tenantsTable, eq(badgesTable.tenantId, tenantsTable.id))
      .where(eq(badgesTable.badgeValue, value))
      .execute();

    if (!row) {
      return;
    }

    const { badges, tenants } = row;

    return BadgeMapper.toDomain({
      badges,
      tenants,
    });
  }
}
