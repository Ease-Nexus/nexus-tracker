import { Provider } from '@nestjs/common';
import { DrizzleBadgeRepository, DrizzleTimerRepository } from './persistence';

export const InfraSimbles = {
  timerRepository: Symbol('timerRepository'),
  badgeRepository: Symbol('badgeRepository'),
};

export const InfraProviders: Provider[] = [];

InfraProviders.push({
  provide: InfraSimbles.timerRepository,
  useClass: DrizzleTimerRepository,
});

InfraProviders.push({
  provide: InfraSimbles.badgeRepository,
  useClass: DrizzleBadgeRepository,
});
