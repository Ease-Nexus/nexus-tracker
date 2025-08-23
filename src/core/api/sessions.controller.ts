import { Body, Controller, Post } from '@nestjs/common';
import { StartSessionUseCase } from '../application/commands/start-session.usecase';
import type { StartSessionDto } from '../domain/dtos';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly startSession: StartSessionUseCase) {}

  @Post()
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
