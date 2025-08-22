import { Module } from '@nestjs/common';
import { ManagementController } from './management.controller';

import { StartSessionUseCase } from './application/commands/start-session.usecase';
import { TimersModule } from '../timers';
import { DatabaseModule } from 'src/shared/database';

@Module({
  imports: [TimersModule, DatabaseModule],
  providers: [StartSessionUseCase],
  controllers: [ManagementController],
})
export class ManagementModule {}
