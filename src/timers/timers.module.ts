import { Module } from '@nestjs/common';
import { TimersService } from './timers.service';
import { TimersController } from './timers.controller';

@Module({
  providers: [TimersService],
  controllers: [TimersController],
})
export class TimersModule {}
