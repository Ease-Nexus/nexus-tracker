import { Body, Controller, Post } from '@nestjs/common';
import { StartSessionUseCase } from './application/commands/start-session.usecase';
import type { StartSessionDto } from './domain/dtos';

@Controller('management')
export class ManagementController {
  constructor(private readonly startSession: StartSessionUseCase) {}

  @Post('sessions')
  async startSessionHandler(@Body() body: StartSessionDto) {
    const { customerId, badge, duration, startImmediately } = body;

    await this.startSession.start({
      customerId,
      badge,
      duration,
      startImmediately,
    });
  }
}
