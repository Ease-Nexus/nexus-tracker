import { Inject, Injectable } from '@nestjs/common';
import { DRIZLE_DB, type DrizzleDatabase } from '../drizzle-setup';
import { Session } from 'src/modules/management/domain/entities';
import { sessionsTable } from '../drizzle-setup/schema';

@Injectable()
export class DrizzleSessionRepository {
  constructor(@Inject(DRIZLE_DB) private readonly db: DrizzleDatabase) {}

  async create(session: Session) {
    await this.db
      .insert(sessionsTable)
      .values({
        id: session.id,
        tenantId: session.tenantId,
        badgeId: session.badgeId,
        customerId: session.customerId ?? null,
        startedAt: session.startedAt,
        endedAt: session.endedAt ?? null,
      })
      .execute();
  }
}
