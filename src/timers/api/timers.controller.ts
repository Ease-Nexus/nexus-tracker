import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';

import {
  CreateTimerUseCase,
  GetTimersUseCase,
  PauseTimerUseCase,
  StartTimerUseCase,
} from '../application';
import { mapToTimerResultDto } from '../domain';

@Controller('timers')
export class TimersController {
  constructor(
    private readonly createTimerUseCase: CreateTimerUseCase,
    private readonly startTimerUseCase: StartTimerUseCase,
    private readonly pauseTimerUseCase: PauseTimerUseCase,
    private readonly getTimersUseCase: GetTimersUseCase,
  ) {}

  @Get()
  async getRunningTimers() {
    const timers = await this.getTimersUseCase.getTimers();
    return timers.map((timer) => mapToTimerResultDto(timer));
  }

  @Post()
  async create(
    @Body() body: { badge: string; durationMinutes: number; started?: boolean },
  ) {
    return await this.createTimerUseCase.create(
      body.badge,
      body.durationMinutes,
      body.started,
    );
  }

  @Put('start/:id')
  async start(@Param('id') id: string) {
    return await this.startTimerUseCase.startTimer(id);
  }

  @Put('pause/:id')
  async pause(@Param('id') id: string) {
    return await this.pauseTimerUseCase.pauseTimer(id);
  }
}
