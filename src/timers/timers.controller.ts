import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { TimersService } from './timers.service';

@Controller('timers')
export class TimersController {
  constructor(private readonly timersService: TimersService) {}

  @Get()
  async getRunningTimers() {
    return await this.timersService.getActiveTimers();
  }

  @Post()
  async create(
    @Body() body: { badge: string; durationMinutes: number; started?: boolean },
  ) {
    return await this.timersService.create(
      body.badge,
      body.durationMinutes,
      body.started,
    );
  }

  @Put('start/:id')
  async start(@Param('id') id: string) {
    return await this.timersService.startTimer(id);
  }

  @Put('stop/:id')
  async stop(@Param('id') id: string) {
    return await this.timersService.pauseTimer(id);
  }
}
