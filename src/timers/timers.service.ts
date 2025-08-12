import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from 'src/main/config/database/db';
import {
  badges,
  timers,
  timerStatusEnum,
} from 'src/main/config/database/schema';

@Injectable()
export class TimersService {
  async findAll() {
    return await db.select().from(timers);
  }

  async create(badge: string, durationMinutes: number) {
    const badgeResult = await db
      .select()
      .from(badges)
      .where(eq(badges.badgeValue, badge))
      .execute();

    if (badgeResult.length > 1 || badgeResult.length === 0) {
      throw new Error('Badge not found');
    }

    const badgeItem = badgeResult[0];

    const now = new Date();

    return await db
      .insert(timers)
      .values({
        badgeId: badgeItem.id,
        durationMinutes,
        status: 'running',
        startTime: now,
      })
      .returning();
  }

  async update(
    id: string,
    status: (typeof timerStatusEnum.enumValues)[number],
  ) {
    return await db
      .update(timers)
      .set({ status })
      .where(eq(timers.id, id))
      .returning();
  }

  async delete(id: string) {
    return await db.delete(timers).where(eq(timers.id, id)).execute();
  }
}
