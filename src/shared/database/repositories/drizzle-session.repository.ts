import { Inject, Injectable } from '@nestjs/common';
import { DRIZLE_DB, type DrizzleDatabase } from '../drizzle-setup';
import {
  Session,
  SessionsGetAllParamsDto,
  SessionsGetByIdParamsDto,
  Tenant,
} from 'src/core/domain';
import { sessionsTable, tenantsTable } from '../drizzle-setup/schema';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class DrizzleSessionRepository {
  constructor(@Inject(DRIZLE_DB) private readonly db: DrizzleDatabase) {}

  async getAll({ tenantCode }: SessionsGetAllParamsDto): Promise<Session[]> {
    const sessions = await this.db.query.sessionsTable.findMany({
      with: {
        tenant: true,
      },
      where: eq(tenantsTable.code, tenantCode),
    });

    return sessions.map((session) =>
      Session.create(
        {
          tenantId: session.tenantId,
          customerId: session.customerId ?? undefined,
          badgeId: session.badgeId,
          startedAt: session.startedAt ?? undefined,
          endedAt: session.endedAt ?? undefined,
          tenant: Tenant.create(
            {
              code: session.tenant.code,
              name: session.tenant.name,
              createdAt: session.tenant.createdAt,
              contactInfo: session.tenant.contactInfo ?? undefined,
              description: session.tenant.description ?? undefined,
            },
            session.tenant.id,
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
    const session = await this.db.query.sessionsTable.findFirst({
      with: {
        tenant: true,
      },
      where: and(eq(tenantsTable.code, tenantCode), eq(sessionsTable.id, id)),
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
        tenant: Tenant.create(
          {
            code: session.tenant.code,
            name: session.tenant.name,
            createdAt: session.tenant.createdAt,
            contactInfo: session.tenant.contactInfo ?? undefined,
            description: session.tenant.description ?? undefined,
          },
          session.tenant.id,
        ),
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
