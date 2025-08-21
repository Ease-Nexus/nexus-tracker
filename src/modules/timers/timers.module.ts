import { Module } from '@nestjs/common';
import { TimersController } from './api/timers.controller';
import { DatabaseModule } from 'src/shared/database/database.module';

import { applicationProviders } from './application';
import { TimerGateway, TimerSchedulerService } from './infrastructure';

@Module({
  imports: [DatabaseModule],
  providers: [TimerSchedulerService, TimerGateway, ...applicationProviders],
  exports: [],
  controllers: [TimersController],
})
export class TimersModule {}
