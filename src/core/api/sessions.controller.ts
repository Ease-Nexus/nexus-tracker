import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseBoolPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateSessionUsecase } from '../application/commands/sessions/create-session.usecase';
import { StartSessionDto } from '../domain/dtos';
import { EndSessionUsecase, GetSessionsUseCase } from '../application';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ExceptionResponseDto } from 'src/main/config';

@Controller('sessions')
export class SessionsController {
  constructor(
    private readonly getSessionsUseCase: GetSessionsUseCase,
    private readonly startSessionUsecase: CreateSessionUsecase,
    private readonly endSessionUsecase: EndSessionUsecase,
  ) {}

  @Get()
  @ApiQuery({
    name: 'isOpen',
    required: false,
    type: Boolean,
  })
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
    const sessions = await this.getSessionsUseCase.getSessions(
      tenantCode,
      isOpen,
    );

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
    const { customerId, badgeValue, duration, startImmediately } = body;

    await this.startSessionUsecase.create(tenantCode, {
      customerId,
      badgeValue,
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
      tenantId: tenantCode,
      id: sessionId,
    });
  }
}
