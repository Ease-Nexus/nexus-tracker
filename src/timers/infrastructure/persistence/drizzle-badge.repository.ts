import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { type DrizzleDatabase } from 'src/main/config';
import { tableBadges } from 'src/main/config/database/schema';
import { DRIZZLE } from 'src/shared/infrastructure';
import { Badge } from 'src/timers/domain';

@Injectable()
export class DrizzleBadgeRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDatabase) {}

  async getByValue(value: string): Promise<Badge | undefined> {
    const [row] = await this.db
      .select()
      .from(tableBadges)
      .where(eq(tableBadges.badgeValue, value))
      .execute();

    if (!row) {
      return;
    }

    const { id, badgeValue, enabled, description } = row;

    return Badge.create({ badgeValue, enabled, description }, id);
  }
}
