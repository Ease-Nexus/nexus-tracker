import { Inject, Injectable } from '@nestjs/common';
import { eq, inArray, sql } from 'drizzle-orm';
import { type DrizzleDatabase } from 'src/main/config';
import { tableBadges, timersTable } from 'src/main/config/database/schema';
import { DRIZZLE } from 'src/shared/infrastructure';
import { Badge, Timer, TimerStatus } from 'src/timers/domain';

@Injectable()
export class DrizzleTimerRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDatabase) {}

  async getByStatus(status: TimerStatus): Promise<Timer[]> {
    const rows = await this.db
      .select()
      .from(timersTable)
      .innerJoin(tableBadges, eq(timersTable.badgeId, tableBadges.id))
      .where(eq(timersTable.status, status))
      .execute();

    return rows.map(({ badges, timers }) =>
      Timer.create(
        {
          badgeId: badges.id,
          badge: Badge.create(
            {
              badgeValue: badges.badgeValue,
              description: badges.description,
              enabled: badges.enabled,
            },
            badges.id,
          ),
          duration: timers.duration,
          elapsed: timers.elapsed,
          history: timers.history,
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
      .innerJoin(tableBadges, eq(timersTable.badgeId, tableBadges.id))
      .where(eq(timersTable.id, timerId))
      .execute();

    const { badges, timers } = row;

    return Timer.create(
      {
        badgeId: badges.id,
        badge: Badge.create(
          {
            badgeValue: badges.badgeValue,
            description: badges.description,
            enabled: badges.enabled,
          },
          badges.id,
        ),
        duration: timers.duration,
        elapsed: timers.elapsed,
        history: timers.history,
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
        badgeId: timer.badgeId,
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
        badgeId: timer.badgeId,
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

    const result = await this.db
      .update(timersTable)
      .set({
        badgeId: this.caseForColumn('badgeId', timers),
        duration: this.caseForColumn('duration', timers),
        elapsed: this.caseForColumn('elapsed', timers),
        status: this.caseForColumn('status', timers),
        startedAt: this.caseForColumn('startedAt', timers),
        lastStartedAt: this.caseForColumn('lastStartedAt', timers),
        history: this.caseForColumn('history', timers),
      })
      .where(inArray(timersTable.id, ids))
      .execute();

    console.log({ result });
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(timersTable).where(eq(timersTable.id, id)).execute();
  }
}
