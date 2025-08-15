import { Module } from '@nestjs/common';
import { TimersService } from './timers.service';
import { TimersController } from './timers.controller';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { InfraProviders, TimerGateway } from './infrastructure';

@Module({
  imports: [DatabaseModule],
  providers: [TimersService, TimerGateway, ...InfraProviders],
  exports: [TimerGateway],
  controllers: [TimersController],
})
export class TimersModule {}
