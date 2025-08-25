import { Body, Controller, Headers, Param, Post } from '@nestjs/common';
import { StartSessionUsecase } from '../application/commands/sessions/start-session.usecase';
import { StartSessionDto } from '../domain/dtos';
import { EndSessionUsecase } from '../application';
import { ApiCreatedResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { ExceptionResponseDto } from 'src/main/config';

@Controller('sessions')
export class SessionsController {
  constructor(
    private readonly startSessionUsecase: StartSessionUsecase,
    private readonly endSessionUsecase: EndSessionUsecase,
  ) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Session created successfully',
  })
  @ApiNotFoundResponse({
    description: 'Badge not found',
    type: ExceptionResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Customer not found',
    type: ExceptionResponseDto,
  })
  async createSession(
    @Headers('x-tenant-code') tenantCode: string,
    @Body() body: StartSessionDto,
  ) {
    const { customerId, badge, duration, startImmediately } = body;

    await this.startSessionUsecase.start(tenantCode, {
      customerId,
      badge,
      duration,
      startImmediately,
    });
  }

  @Post(':sessionId/end')
  async endSession(
    @Headers() tenantCode: string,
    @Param('sessionId') sessionId: string,
  ) {
    await this.endSessionUsecase.end({
      tenantCode,
      id: sessionId,
    });
  }
}
