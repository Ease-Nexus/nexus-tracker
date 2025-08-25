import { Inject, Injectable } from '@nestjs/common';
import { DRIZLE_DB, type DrizzleDatabase } from '../drizzle-setup';
import {
  Session,
  SessionsGetAllParamsDto,
  SessionsGetByIdParamsDto,
  Tenant,
} from 'src/core/domain';
import { sessionsTable, tenantsTable } from '../drizzle-setup/schema';
import { and, eq, sql } from 'drizzle-orm';

@Injectable()
export class DrizzleSessionRepository {
  constructor(@Inject(DRIZLE_DB) private readonly db: DrizzleDatabase) {}

  async getAll({ tenantCode }: SessionsGetAllParamsDto): Promise<Session[]> {
    const results = await this.db
      .select({
        session: sessionsTable,
        tenant: tenantsTable,
      })
      .from(sessionsTable)
      .innerJoin(tenantsTable, eq(sessionsTable.tenantId, tenantsTable.id))
      .where(eq(tenantsTable.code, tenantCode));

    return results.map(({ session, tenant }) =>
      Session.create(
        {
          tenantCode: session.tenantId,
          customerId: session.customerId ?? undefined,
          badgeId: session.badgeId,
          startedAt: session.startedAt ?? undefined,
          endedAt: session.endedAt ?? undefined,
          tenant: Tenant.create(
            {
              code: tenant.code,
              name: tenant.name,
              createdAt: tenant.createdAt,
              contactInfo: tenant.contactInfo ?? undefined,
              description: tenant.description ?? undefined,
            },
            tenant.id,
          ),
        },
        session.id,
      ),
    );
  }

  async getById({
    tenantCode,
    id,
  }: SessionsGetByIdParamsDto): Promise<Session | undefined> {
    const result = await this.db
      .select({
        session: sessionsTable,
        tenant: tenantsTable,
      })
      .from(sessionsTable)
      .innerJoin(tenantsTable, eq(sessionsTable.tenantId, tenantsTable.id))
      .where(and(eq(tenantsTable.code, tenantCode), eq(sessionsTable.id, id)))
      .limit(1);

    if (!result.length) {
      return;
    }

    const { session, tenant } = result[0];

    if (!session || !tenant) {
      return;
    }

    return Session.create(
      {
        tenantCode: session.tenantId,
        customerId: session.customerId ?? undefined,
        badgeId: session.badgeId,
        startedAt: session.startedAt ?? undefined,
        endedAt: session.endedAt ?? undefined,
        tenant: Tenant.create(
          {
            code: tenant.code,
            name: tenant.name,
            createdAt: tenant.createdAt,
            contactInfo: tenant.contactInfo ?? undefined,
            description: tenant.description ?? undefined,
          },
          tenant.id,
        ),
      },
      session.id,
    );
  }

  async create(session: Session) {
    await this.db.transaction(async (tx) => {
      await tx
        .insert(sessionsTable)
        .values({
          id: session.id,
          tenantId: sql`(SELECT id FROM ${tenantsTable} WHERE ${tenantsTable.code} = ${session.tenantCode})`,
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
