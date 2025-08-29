import { Module } from '@nestjs/common';

import {
  DrizzleBadgeRepository,
  DrizzleSessionRepository,
  DrizzleTenantRepository,
  DrizzleTimerRepository,
} from './repositories';
import { DrizzleProvider } from './drizzle-setup';

@Module({
  providers: [
    DrizzleProvider,
    DrizzleTenantRepository,
    DrizzleTimerRepository,
    DrizzleBadgeRepository,
    DrizzleSessionRepository,
  ],
  exports: [
    DrizzleTenantRepository,
    DrizzleTimerRepository,
    DrizzleBadgeRepository,
    DrizzleSessionRepository,
  ],
})
export class DatabaseModule {}
