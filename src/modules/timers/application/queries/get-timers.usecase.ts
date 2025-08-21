import { Inject, Injectable } from '@nestjs/common';
import { databaseSymbols, DrizzleTimerRepository } from 'src/shared';

@Injectable()
export class GetTimersUseCase {
  constructor(
    @Inject(databaseSymbols.timerRepository)
    private readonly timerRepository: DrizzleTimerRepository,
  ) {}

  async getTimers() {
    return await this.timerRepository.getByStatus([
      'CREATED',
      'RUNNING',
      'PAUSED',
    ]);
  }
}
