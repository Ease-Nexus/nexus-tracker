import { Module } from '@nestjs/common';
import { TimersModule } from './modules';
import { ConfigModule } from '@nestjs/config';
import { ManagementModule } from './modules/management/management.module';
import { DatabaseModule } from './shared';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    TimersModule,
    ManagementModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
