import { Module } from '@nestjs/common';
import { SessionsController } from './api/sessions.controller';

import { CreateSessionUsecase } from './application/commands/sessions/create-session.usecase';

import { DatabaseModule } from 'src/shared/database';
import {
  CompleteTimerUsecase,
  CreateTimerUseCase,
  EndSessionUsecase,
  GetSessionByIdUsecase,
  GetSessionsUseCase,
  GetTimersUseCase,
  PauseTimerUseCase,
  StartTimerUseCase,
} from './application';
import { TimerGateway, TimerSchedulerService } from './infrastructure';
import { TimersController } from './api';

@Module({
  imports: [DatabaseModule],
  providers: [
    // Infrastructure
    TimerGateway,
    TimerSchedulerService,
    // Session
    GetSessionsUseCase,
    GetSessionByIdUsecase,
    CreateSessionUsecase,
    EndSessionUsecase,

    // Timer
    GetTimersUseCase,
    CreateTimerUseCase,
    StartTimerUseCase,
    PauseTimerUseCase,
    CompleteTimerUsecase,
  ],
  controllers: [SessionsController, TimersController],
})
export class CoreModule {}
