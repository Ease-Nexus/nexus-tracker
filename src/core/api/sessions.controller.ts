import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseBoolPipe,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CreateSessionUsecase } from '../application/commands/sessions/create-session.usecase';
import { StartSessionDto } from '../domain/dtos';
import {
  EndSessionUsecase,
  GetSessionByIdUsecase,
  GetSessionsUseCase,
} from '../application';
import { ZodValidationInterceptor } from 'src/main/interceptors';
import { z } from 'zod';
import { tenantValidationInterceptor } from './interceptors';

const createSessionSchema = z.object({
  customerId: z.string().optional(),
  badgeValue: z.string(),
  duration: z.number().min(0.01),
  startImmediately: z.boolean().optional(),
});

const endSessionBodySchema = z.object({
  forceCompleteTimer: z.boolean().optional(),
});

const endSessionParamsSchema = z.object({
  sessionId: z.string(),
});

type EndSessionParams = z.infer<typeof endSessionParamsSchema>;
type EndSessionBody = z.infer<typeof endSessionBodySchema>;

@Controller('sessions')
@UseInterceptors(tenantValidationInterceptor)
export class SessionsController {
  constructor(
    private readonly getSessionsUseCase: GetSessionsUseCase,
    private readonly getSessionsByIdUsecase: GetSessionByIdUsecase,
    private readonly startSessionUsecase: CreateSessionUsecase,
    private readonly endSessionUsecase: EndSessionUsecase,
  ) {}

  @Get(':sessionId')
  @UseInterceptors(
    new ZodValidationInterceptor({
      paramsSchema: z.object({
        sessionId: z.string(),
      }),
    }),
  )
  async getSession(
    @Headers('x-tenant-code') tenantCode: string,
    @Param('sessionId') sessionId: string,
  ) {
    const session = await this.getSessionsByIdUsecase.getSession(
      tenantCode,
      sessionId,
    );

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
  @UseInterceptors(
    new ZodValidationInterceptor({
      querySchema: z.object({ isOpen: z.boolean().optional() }),
    }),
  )
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
  @UseInterceptors(
    new ZodValidationInterceptor({ bodySchema: createSessionSchema }),
  )
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
  @UseInterceptors(
    new ZodValidationInterceptor({
      bodySchema: endSessionBodySchema,
      paramsSchema: endSessionParamsSchema,
    }),
  )
  async endSession(
    @Headers('x-tenant-code') tenantCode: string,
    @Param() { sessionId }: EndSessionParams,
    @Body() { forceCompleteTimer }: EndSessionBody,
  ) {
    await this.endSessionUsecase.end({
      tenantCode,
      id: sessionId,
      forceCompleteTimer,
    });
  }
}
