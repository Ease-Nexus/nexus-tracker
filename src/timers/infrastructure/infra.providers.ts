import { Provider } from '@nestjs/common';
import { DrizzleBadgeRepository, DrizzleTimerRepository } from './persistence';
import { TimerGateway, TimerSchedulerService } from './services';
import { InfraSymbols } from './infra-simbols';

export const InfraProviders: Provider[] = [
  TimerGateway,
  TimerSchedulerService,
  {
    provide: InfraSymbols.timerRepository,
    useClass: DrizzleTimerRepository,
  },
  {
    provide: InfraSymbols.badgeRepository,
    useClass: DrizzleBadgeRepository,
  },
];
