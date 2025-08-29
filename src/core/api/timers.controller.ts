import {
  Body,
  Controller,
  Get,
  Param,
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
import z from 'zod';

@Controller('timers')
@UseInterceptors(
  new ZodValidationInterceptor({
    headerSchema: z.object({
      'x-tenant-code': z.string(),
    }),
  }),
)
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

  @Put('start/:id')
  async start(@Param('id') id: string) {
    return await this.startTimerUseCase.startTimer(id);
  }

  @Put('stop/:id')
  async pause(@Param('id') id: string) {
    return await this.pauseTimerUseCase.pauseTimer(id);
  }
}
