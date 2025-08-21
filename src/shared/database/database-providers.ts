import { Provider } from '@nestjs/common';
import { DrizzleBadgeRepository, DrizzleTimerRepository } from './repositories';
import { databaseSymbols } from './database-symbols';

export const TimerRepositoryProvider: Provider = {
  provide: databaseSymbols.timerRepository,
  useClass: DrizzleTimerRepository,
};

export const BadgeRepositoryProvider: Provider = {
  provide: databaseSymbols.badgeRepository,
  useClass: DrizzleBadgeRepository,
};

export const DatabaseProviders: Provider[] = [
  TimerRepositoryProvider,
  BadgeRepositoryProvider,
];
