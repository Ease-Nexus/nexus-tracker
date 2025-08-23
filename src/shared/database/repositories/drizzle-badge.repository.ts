import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { DRIZLE_DB, type DrizzleDatabase } from '../drizzle-setup';
import {
  badgesTable,
  sessionsTable,
  tenantsTable,
} from '../drizzle-setup/schema';
import { BadgeMapper } from './mappers';

import { Badge } from 'src/core/domain';

@Injectable()
export class DrizzleBadgeRepository {
  constructor(@Inject(DRIZLE_DB) private readonly db: DrizzleDatabase) {}

  async getByValue(value: string): Promise<Badge | undefined> {
    const [row] = await this.db
      .select()
      .from(badgesTable)
      .innerJoin(tenantsTable, eq(badgesTable.tenantId, tenantsTable.id))
      .leftJoin(sessionsTable, eq(sessionsTable.badgeId, badgesTable.id))
      .where(eq(badgesTable.badgeValue, value))
      .execute();

    if (!row) {
      return;
    }

    const { badges, tenants, sessions } = row;

    return BadgeMapper.toDomain({
      badges,
      tenants,
      sessions, // Handle optional session data
    });
  }
}
