import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TimersService } from './timers.service';
import { TimerStatus } from './domain';

@Controller('timers')
export class TimersController {
  constructor(private readonly timersService: TimersService) {}

  @Get()
  async getAll() {
    return await this.timersService.findAll();
  }

  @Post()
  async create(@Body() body: { badge: string; durationMinutes: number }) {
    return await this.timersService.create(body.badge, body.durationMinutes);
  }

  @Put(':id')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: TimerStatus },
  ) {
    return await this.timersService.update(id, body.status);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.timersService.delete(id);
  }
}
