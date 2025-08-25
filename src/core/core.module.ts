import { Module } from '@nestjs/common';
import { SessionsController } from './api/sessions.controller';

import { StartSessionUsecase } from './application/commands/sessions/start-session.usecase';

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
    StartSessionUsecase,
    EndSessionUsecase,
    TimerSchedulerService,
    CreateTimerUseCase,
    StartTimerUseCase,
    PauseTimerUseCase,
    StartSessionUsecase,
    GetTimersUseCase,
  ],
  controllers: [SessionsController, TimersController],
})
export class CoreModule {}
