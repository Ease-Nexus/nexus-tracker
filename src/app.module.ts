import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ManagementModule } from './modules/management/management.module';
import { DatabaseModule } from './shared/database';
import { TimersModule } from './modules';

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
