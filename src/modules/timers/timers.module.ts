import { Module } from '@nestjs/common';
import { TimersController } from './api/timers.controller';
import { DatabaseModule } from 'src/shared/database/database.module';

import { TimerGateway, TimerSchedulerService } from './infrastructure';
import {
  CreateTimerUseCase,
  StartTimerUseCase,
  PauseTimerUseCase,
  GetTimersUseCase,
} from './application';

@Module({
  imports: [DatabaseModule],
  providers: [
    TimerSchedulerService,
    TimerGateway,
    CreateTimerUseCase,
    StartTimerUseCase,
    PauseTimerUseCase,
    GetTimersUseCase,
  ],
  exports: [CreateTimerUseCase],
  controllers: [TimersController],
})
export class TimersModule {}
