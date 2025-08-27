import { Inject, Injectable } from '@nestjs/common';
import { DRIZLE_DB, type DrizzleDatabase } from '../drizzle-setup';
import { Session, SessionsGetAllParamsDto, SessionsGetByIdParamsDto } from 'src/core/domain';
import { badgesTable, sessionsTable, tenantsTable } from '../drizzle-setup/schema';
import { and, eq, isNull } from 'drizzle-orm';
import { SessionMapper } from './mappers';

@Injectable()
export class DrizzleSessionRepository {
  constructor(@Inject(DRIZLE_DB) private readonly db: DrizzleDatabase) {}

  async getAll({ tenantId, isOpen }: SessionsGetAllParamsDto): Promise<Session[]> {
    const results = await this.db
      .select({
        session: sessionsTable,
        tenant: tenantsTable,
        badge: badgesTable,
      })
      .from(sessionsTable)
      .innerJoin(tenantsTable, eq(sessionsTable.tenantId, tenantsTable.id))
      .innerJoin(badgesTable, eq(sessionsTable.badgeId, badgesTable.id))
      .where(and(eq(sessionsTable.tenantId, tenantId), isOpen ? isNull(sessionsTable.endedAt) : undefined));

    return results.map(({ session, tenant, badge }) =>
      SessionMapper.toDomain({
        session,
        tenant,
        badge,
      }),
    );
  }

  async getById({ tenantId, id }: SessionsGetByIdParamsDto): Promise<Session | undefined> {
    const result = await this.db
      .select({
        session: sessionsTable,
        tenant: tenantsTable,
        badge: badgesTable,
      })
      .from(sessionsTable)
      .innerJoin(tenantsTable, eq(sessionsTable.tenantId, tenantsTable.id))
      .innerJoin(badgesTable, eq(sessionsTable.badgeId, badgesTable.id))
      .where(and(eq(sessionsTable.tenantId, tenantId), eq(sessionsTable.id, id)))
      .limit(1);

    if (!result.length) {
      return;
    }

    const { session, tenant, badge } = result[0];

    return SessionMapper.toDomain({
      session,
      tenant,
      badge,
    });
  }

  async create(session: Session) {
    await this.db.transaction(async (tx) => {
      await tx
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
    });
  }

  async update(session: Session) {
    await this.db
      .update(sessionsTable)
      .set({
        startedAt: session.startedAt,
        endedAt: session.endedAt ?? null,
      })
      .where(eq(sessionsTable.id, session.id))
      .execute();
  }
}
