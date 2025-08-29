import { Injectable } from '@nestjs/common';
import {
  TenantNotFoundException,
  TimerNotFoundException,
  TimerStateManagementUsecaseDto,
} from 'src/core/domain';
import { TimerSchedulerService } from 'src/core/infrastructure';
import {
  DrizzleTenantRepository,
  DrizzleTimerRepository,
} from 'src/shared/database';

@Injectable()
export class PauseTimerUseCase {
  constructor(
    private readonly tenantRepository: DrizzleTenantRepository,
    private readonly timerRepository: DrizzleTimerRepository,
    private readonly timerSchedulerService: TimerSchedulerService,
  ) {}

  async pauseTimer({ tenantCode, timerId }: TimerStateManagementUsecaseDto) {
    const tenant = await this.tenantRepository.getByCode(tenantCode);

    if (!tenant) {
      throw new TenantNotFoundException();
    }

    const timer = await this.timerRepository.getById({
      tenantId: tenant.id,
      timerId,
    });

    if (!timer) {
      throw new TimerNotFoundException();
    }

    timer.pause();

    await this.timerRepository.update(timer);
    this.timerSchedulerService.pauseTimer(timer);
  }
}
