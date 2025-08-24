import { Inject, Injectable } from '@nestjs/common';
import { DRIZLE_DB, type DrizzleDatabase } from '../drizzle-setup';
import { Session } from 'src/core/domain';
import { sessionsTable } from '../drizzle-setup/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class DrizzleSessionRepository {
  constructor(@Inject(DRIZLE_DB) private readonly db: DrizzleDatabase) {}

  async getById(id: string): Promise<Session | undefined> {
    const session = await this.db.query.sessionsTable.findFirst({
      where: eq(sessionsTable.id, id),
    });

    if (!session) {
      return;
    }

    return Session.create(
      {
        tenantId: session.tenantId,
        customerId: session.customerId ?? undefined,
        badgeId: session.badgeId,
        startedAt: session.startedAt ?? undefined,
        endedAt: session.endedAt ?? undefined,
      },
      session.id,
    );
  }

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

  async update(session: Session) {
    await this.db
      .update(sessionsTable)
      .set({
        tenantId: session.tenantId,
        badgeId: session.badgeId,
        customerId: session.customerId ?? null,
        startedAt: session.startedAt,
        endedAt: session.endedAt ?? null,
      })
      .where(eq(sessionsTable.id, session.id))
      .execute();
  }
}
