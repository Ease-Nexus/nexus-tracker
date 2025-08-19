import { Module } from '@nestjs/common';
import { TimersController } from './timers.controller';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { InfraProviders } from './infrastructure';
import { applicationProviders } from './application';

@Module({
  imports: [DatabaseModule],
  providers: [...InfraProviders, ...applicationProviders],
  exports: [],
  controllers: [TimersController],
})
export class TimersModule {}
