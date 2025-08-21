import { Module } from '@nestjs/common';
import { TimersModule } from '../timers';

@Module({
  imports: [TimersModule],
})
export class ManagementModule {}
