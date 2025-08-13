import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { type DrizzleDatabase } from 'src/main/config';
import { timersTable } from 'src/main/config/database/schema';
import { DRIZZLE } from 'src/shared/infrastructure';
import { Timer } from 'src/timers/domain';

@Injectable()
export class DrizzleTimerRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDatabase) {}

  async findAll(): Promise<Timer[]> {
    const rows = await this.db.select().from(timersTable).execute();

    return rows.map((row) =>
      Timer.create(
        {
          badgeId: row.badgeId,
          duration: row.duration,
          remaining: row.remaining ?? 0,
          status: row.status,
          startedAt: row.startedAt ?? undefined,
          endAt: row.endAt ?? undefined,
        },
        row.id,
      ),
    );
  }

  async getById(timerId: string): Promise<Timer> {
    const [row] = await this.db
      .select()
      .from(timersTable)
      .where(eq(timersTable.id, timerId))
      .execute();

    if (!row) {
      throw new Error('Timer not found');
    }

    const { id, badgeId, duration, remaining, status, startedAt, endAt } = row;

    return Timer.create(
      {
        badgeId,
        duration,
        remaining: remaining ?? 0,
        status,
        startedAt: startedAt ?? undefined,
        endAt: endAt ?? undefined,
      },
      id,
    );
  }

  async create(timer: Timer): Promise<void> {
    await this.db
      .insert(timersTable)
      .values({
        id: timer.id,
        badgeId: timer.badgeId,
        duration: timer.duration,
        remaining: timer.remaining,
        status: timer.status,
        startedAt: timer.startedAt,
        endAt: timer.endAt,
      })
      .execute();
  }

  async update(timer: Timer): Promise<void> {
    await this.db
      .update(timersTable)
      .set({
        badgeId: timer.badgeId,
        duration: timer.duration,
        remaining: timer.remaining,
        status: timer.status,
        startedAt: timer.startedAt,
        endAt: timer.endAt,
      })
      .where(eq(timersTable.id, timer.id))
      .execute();
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(timersTable).where(eq(timersTable.id, id)).execute();
  }
}
