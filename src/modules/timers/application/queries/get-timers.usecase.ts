import { Injectable } from '@nestjs/common';
import { DrizzleTimerRepository } from 'src/shared';

@Injectable()
export class GetTimersUseCase {
  constructor(private readonly timerRepository: DrizzleTimerRepository) {}

  async getTimers() {
    return await this.timerRepository.getByStatus([
      'CREATED',
      'RUNNING',
      'PAUSED',
    ]);
  }
}
