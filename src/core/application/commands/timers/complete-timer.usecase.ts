import { DrizzleTimerRepository } from 'src/shared/database';

export class CompleteTimerUsecase {
  constructor(private readonly timerRepository: DrizzleTimerRepository) {}

  async complete(timerId: string) {
    const timer = await this.timerRepository.getById(timerId);

    timer.complete();

    await this.timerRepository.update(timer);
  }
}
