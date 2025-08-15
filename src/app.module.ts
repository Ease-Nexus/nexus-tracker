import { Module } from '@nestjs/common';
import { TimersModule } from './timers/timers.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TimersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
