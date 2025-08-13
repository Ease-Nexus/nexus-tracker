import { Inject, Injectable } from '@nestjs/common';
import {
  DrizzleBadgeRepository,
  DrizzleTimerRepository,
  InfraSimbles,
} from './infrastructure';
import { Timer, TimerStatus } from './domain';

@Injectable()
export class TimersService {
  constructor(
    @Inject(InfraSimbles.timerRepository)
    private readonly timerRepository: DrizzleTimerRepository,
    @Inject(InfraSimbles.badgeRepository)
    private readonly badgeRepository: DrizzleBadgeRepository,
  ) {}
  async findAll() {
    return await this.timerRepository.findAll();
  }

  async create(badge: string, durationMinutes: number, started?: boolean) {
    const badgeResult = await this.badgeRepository.getByValue(badge);

    return await this.timerRepository.create(
      Timer.createNew(badgeResult.id, durationMinutes, started),
    );
  }

  async update(id: string, status: TimerStatus) {
    const timer = await this.timerRepository.getById(id);

    const validStatuses: TimerStatus[] = ['RUNNING', 'PAUSED', 'CANCELED'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    switch (status) {
      case 'PAUSED':
        timer.pause();
        break;
      case 'CANCELED':
        timer.cancel();
        break;
      default:
        timer.start();
    }

    await this.timerRepository.update(timer);
  }

  async delete(id: string) {
    await this.timerRepository.delete(id);
  }
}
