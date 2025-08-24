import { Module } from '@nestjs/common';
import { SessionsController } from './api/sessions.controller';

import { StartSessionUseCase } from './application/commands/start-session.usecase';

import { DatabaseModule } from 'src/shared/database';
import {
  CreateTimerUseCase,
  EndSessionUsecase,
  GetTimersUseCase,
  PauseTimerUseCase,
  StartTimerUseCase,
} from './application';
import { TimerGateway, TimerSchedulerService } from './infrastructure';
import { TimersController } from './api';

@Module({
  imports: [DatabaseModule],
  providers: [
    TimerGateway,
    StartSessionUseCase,
    EndSessionUsecase,
    TimerSchedulerService,
    CreateTimerUseCase,
    StartTimerUseCase,
    PauseTimerUseCase,
    StartSessionUseCase,
    GetTimersUseCase,
  ],
  controllers: [SessionsController, TimersController],
})
export class CoreModule {}
