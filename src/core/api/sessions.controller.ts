import { Body, Controller, Get, Headers, Param, ParseBoolPipe, Post, Query } from '@nestjs/common';
import { CreateSessionUsecase } from '../application/commands/sessions/create-session.usecase';
import { StartSessionDto } from '../domain/dtos';
import { EndSessionUsecase, GetSessionByIdUsecase, GetSessionsUseCase } from '../application';

@Controller('sessions')
export class SessionsController {
  constructor(
    private readonly getSessionsUseCase: GetSessionsUseCase,
    private readonly getSessionsByIdUsecase: GetSessionByIdUsecase,
    private readonly startSessionUsecase: CreateSessionUsecase,
    private readonly endSessionUsecase: EndSessionUsecase,
  ) {}

  @Get(':sessionId')
  async getSession(@Headers('x-tenant-code') tenantCode: string, @Param('sessionId') sessionId: string) {
    const session = await this.getSessionsByIdUsecase.getSession(tenantCode, sessionId);

    return {
      id: session.id,
      customerId: session.customerId,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      isOpen: session.isOpen(),
      badge: {
        type: session.badge?.badgeType,
        value: session.badge?.badgeValue,
        description: session.badge?.description,
      },
    };
  }

  @Get()
  async getSessions(
    @Headers('x-tenant-code') tenantCode: string,
    @Query(
      'isOpen',
      new ParseBoolPipe({
        optional: true,
      }),
    )
    isOpen?: boolean,
  ) {
    const sessions = await this.getSessionsUseCase.getSessions(tenantCode, isOpen);

    return sessions.map((session) => ({
      id: session.id,
      customerId: session.customerId,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      isOpen: session.isOpen(),
      badge: {
        type: session.badge?.badgeType,
        value: session.badge?.badgeValue,
        description: session.badge?.description,
      },
    }));
  }

  @Post()
  async createSession(@Headers('x-tenant-code') tenantCode: string, @Body() body: StartSessionDto) {
    const { customerId, badgeValue, duration, startImmediately } = body;

    await this.startSessionUsecase.create(tenantCode, {
      customerId,
      badgeValue,
      duration,
      startImmediately,
    });
  }

  @Post(':sessionId/end')
  async endSession(@Headers() tenantCode: string, @Param('sessionId') sessionId: string) {
    await this.endSessionUsecase.end({
      tenantId: tenantCode,
      id: sessionId,
    });
  }
}
