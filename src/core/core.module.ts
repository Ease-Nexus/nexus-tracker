import { Module } from '@nestjs/common';
import { SessionsController } from './api/sessions.controller';

import { CreateSessionUsecase } from './application/commands/sessions/create-session.usecase';

import { DatabaseModule } from 'src/shared/database';
import {
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
    TimerGateway,
    GetSessionsUseCase,
    GetSessionByIdUsecase,
    CreateSessionUsecase,
    EndSessionUsecase,
    TimerSchedulerService,
    CreateTimerUseCase,
    StartTimerUseCase,
    PauseTimerUseCase,
    CreateSessionUsecase,
    GetTimersUseCase,
  ],
  controllers: [SessionsController, TimersController],
})
export class CoreModule {}
