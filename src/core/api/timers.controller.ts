import {
  Body,
  Controller,
  Get,
  Param,
  Headers,
  Put,
  UseInterceptors,
} from '@nestjs/common';

import {
  GetTimersUseCase,
  PauseTimerUseCase,
  StartTimerUseCase,
} from '../application';
import { mapToTimerResultDto } from '../domain';
import { ZodValidationInterceptor } from 'src/main/interceptors';
import { z } from 'zod';
import { tenantValidationInterceptor } from './interceptors';
const startTimerSchema = z.object({
  timerId: z.string(),
});
const pauseTimerSchema = z.object({
  timerId: z.string(),
});

@Controller('timers')
@UseInterceptors(tenantValidationInterceptor)
export class TimersController {
  constructor(
    private readonly startTimerUseCase: StartTimerUseCase,
    private readonly pauseTimerUseCase: PauseTimerUseCase,
    private readonly getTimersUseCase: GetTimersUseCase,
  ) {}

  @Get()
  async getRunningTimers() {
    const timers = await this.getTimersUseCase.getTimers();
    return timers.map((timer) => mapToTimerResultDto(timer));
  }

  @Put('start/:timerId')
  @UseInterceptors(
    new ZodValidationInterceptor({
      paramsSchema: startTimerSchema,
    }),
  )
  async start(
    @Headers('x-tenant-code') tenantCode: string,
    @Param('timerId') timerId: string,
  ) {
    return await this.startTimerUseCase.startTimer({ tenantCode, timerId });
  }

  @Put('stop/:timerId')
  @UseInterceptors(
    new ZodValidationInterceptor({
      paramsSchema: pauseTimerSchema,
    }),
  )
  async pause(
    @Headers('x-tenant-code') tenantCode: string,
    @Param('timerId') timerId: string,
  ) {
    return await this.pauseTimerUseCase.pauseTimer({
      tenantCode,
      timerId,
    });
  }
}
