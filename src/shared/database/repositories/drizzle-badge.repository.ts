import { Inject, Injectable } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';

import { DRIZLE_DB, type DrizzleDatabase } from '../drizzle-setup';
import { badgesTable, sessionsTable } from '../drizzle-setup/schema';
import { BadgeMapper } from './mappers';

import { Badge } from 'src/core/domain';

@Injectable()
export class DrizzleBadgeRepository {
  constructor(@Inject(DRIZLE_DB) private readonly db: DrizzleDatabase) {}

  async getByValue(
    tenantId: string,
    value: string,
  ): Promise<Badge | undefined> {
    const [row] = await this.db
      .select({
        badge: badgesTable,
        session: sessionsTable,
      })
      .from(badgesTable)
      .leftJoin(sessionsTable, eq(sessionsTable.badgeId, badgesTable.id))
      .where(
        and(
          eq(badgesTable.tenantId, tenantId),
          eq(badgesTable.badgeValue, value),
        ),
      )
      .orderBy(desc(sessionsTable.endedAt))
      .execute();

    if (!row) {
      return;
    }

    const { badge, session } = row;

    return BadgeMapper.toDomain({
      badge,
      session, // Handle optional session data
    });
  }
}
