import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { type DrizzleDatabase } from 'src/main/config';
import { badges } from 'src/main/config/database/schema';
import { DRIZZLE } from 'src/shared/infrastructure';
import { Badge } from 'src/timers/domain';

@Injectable()
export class DrizzleBadgeRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDatabase) {}

  async getByValue(value: string): Promise<Badge> {
    const [row] = await this.db
      .select()
      .from(badges)
      .where(eq(badges.badgeValue, value))
      .execute();

    if (!row) {
      throw new Error('Badge not found');
    }

    const { id, badgeValue, enabled, description } = row;

    return Badge.create({ badgeValue, enabled, description }, id);
  }
}
