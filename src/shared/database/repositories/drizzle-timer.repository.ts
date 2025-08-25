import { Inject, Injectable } from '@nestjs/common';
import { eq, inArray, SQL, sql } from 'drizzle-orm';

import { Tenant, Timer, TimerStatus } from 'src/core/domain';
import { DRIZLE_DB, type DrizzleDatabase } from '../drizzle-setup';
import { tenantsTable, timersTable } from '../drizzle-setup/schema';

@Injectable()
export class DrizzleTimerRepository {
  constructor(@Inject(DRIZLE_DB) private readonly db: DrizzleDatabase) {}

  async getByStatus(status: TimerStatus | TimerStatus[]): Promise<Timer[]> {
    const whereClause: SQL = Array.isArray(status)
      ? inArray(timersTable.status, status).getSQL()
      : eq(timersTable.status, status).getSQL();

    const rows = await this.db
      .select()
      .from(timersTable)
      .innerJoin(tenantsTable, eq(timersTable.tenantId, tenantsTable.id))
      .where(whereClause)
      .execute();

    return rows.map(({ tenants, timers }) =>
      Timer.create(
        {
          tenantCode: tenants.code,
          tenant: Tenant.create(
            {
              code: tenants.code,
              name: tenants.name,
              description: tenants.description ?? undefined,
              contactInfo: tenants.contactInfo ?? undefined,
              createdAt: tenants.createdAt,
            },
            tenants.id,
          ),
          sessionId: timers.sessionId,

          duration: timers.duration,
          elapsed: timers.elapsed,
          history: timers.history.map((h) => ({
            start: new Date(h.start),
            end: h.end ? new Date(h.end) : undefined,
            elapsed: h.elapsed,
          })),
          status: timers.status,
          startedAt: timers.startedAt ?? undefined,
          lastStartedAt: timers.lastStartedAt ?? undefined,
        },
        timers.id,
      ),
    );
  }

  async getById(timerId: string): Promise<Timer> {
    const [row] = await this.db
      .select()
      .from(timersTable)
      .innerJoin(tenantsTable, eq(timersTable.tenantId, tenantsTable.id))
      .where(eq(timersTable.id, timerId))
      .execute();

    const { tenants, timers } = row;

    return Timer.create(
      {
        tenantCode: tenants.code,
        tenant: Tenant.create({
          code: tenants.code,
          name: tenants.name,
          contactInfo: tenants.contactInfo ?? undefined,
          description: tenants.description ?? undefined,
          createdAt: tenants.createdAt,
        }),
        sessionId: timers.sessionId,
        duration: timers.duration,
        elapsed: timers.elapsed,
        history: timers.history.map((h) => ({
          start: new Date(h.start),
          end: h.end ? new Date(h.end) : undefined,
          elapsed: h.elapsed,
        })),
        status: timers.status,
        startedAt: timers.startedAt ?? undefined,
        lastStartedAt: timers.lastStartedAt ?? undefined,
      },
      timers.id,
    );
  }

  async create(timer: Timer): Promise<void> {
    await this.db
      .insert(timersTable)
      .values({
        id: timer.id,
        tenantId: sql`(SELECT id FROM ${tenantsTable} WHERE ${tenantsTable.code} = ${timer.tenantCode})`,
        sessionId: timer.sessionId,
        duration: timer.duration,
        elapsed: timer.elapsed,
        status: timer.status,
        startedAt: timer.startedAt,
        lastStartedAt: timer.lastStartedAt,
      })
      .execute();
  }

  async update(timer: Timer): Promise<void> {
    await this.db
      .update(timersTable)
      .set({
        tenantId: sql`(SELECT id FROM ${tenantsTable} WHERE ${tenantsTable.code} = ${timer.tenantCode})`,
        sessionId: timer.sessionId,
        duration: timer.duration,
        elapsed: timer.elapsed,
        status: timer.status,
        startedAt: timer.startedAt,
        lastStartedAt: timer.lastStartedAt,
        history: timer.history,
      })
      .where(eq(timersTable.id, timer.id))
      .execute();
  }

  private caseForColumn(column: keyof Timer['props'], timers: Timer[]) {
    return sql`
      CASE ${timersTable.id}
        ${sql.raw(
          timers
            .map((t) => {
              const value = t[column];

              if (column === 'history') {
                return `WHEN '${t.id}' THEN '${`${JSON.stringify(value)}`}'::jsonb`;
              }
              if (value instanceof Date) {
                return `WHEN '${t.id}' THEN '${value.toISOString()}'`;
              }
              if (value === undefined || value === null) {
                return `WHEN '${t.id}' THEN NULL`;
              }
              return `WHEN '${t.id}' THEN '${value as string}'`;
            })
            .join(' '),
        )}
        ELSE ${timersTable[column]}
      END
    `;
  }

  async bulkUpdate(timers: Timer[]) {
    if (timers.length === 0) {
      return;
    }
    const ids = timers.map((t) => t.id);

    // const result = await this.db
    await this.db
      .update(timersTable)
      .set({
        duration: this.caseForColumn('duration', timers),
        elapsed: this.caseForColumn('elapsed', timers),
        status: this.caseForColumn('status', timers),
        startedAt: this.caseForColumn('startedAt', timers),
        lastStartedAt: this.caseForColumn('lastStartedAt', timers),
        history: this.caseForColumn('history', timers),
      })
      .where(inArray(timersTable.id, ids))
      .execute();
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(timersTable).where(eq(timersTable.id, id)).execute();
  }
}
