import { Module } from '@nestjs/common';

import {
  DrizzleBadgeRepository,
  DrizzleSessionRepository,
  DrizzleTimerRepository,
} from './repositories';
import { DrizzleProvider } from './drizzle-setup';

@Module({
  providers: [
    DrizzleProvider,
    DrizzleTimerRepository,
    DrizzleBadgeRepository,
    DrizzleSessionRepository,
  ],
  exports: [
    DrizzleTimerRepository,
    DrizzleBadgeRepository,
    DrizzleSessionRepository,
  ],
})
export class DatabaseModule {}
