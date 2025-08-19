import { Inject, Injectable } from '@nestjs/common';
import {
  DrizzleTimerRepository,
  InfraSymbols,
} from 'src/timers/infrastructure';

@Injectable()
export class GetTimersUseCase {
  constructor(
    @Inject(InfraSymbols.timerRepository)
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
