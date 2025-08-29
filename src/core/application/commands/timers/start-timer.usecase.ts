import { Injectable } from '@nestjs/common';
import {
  TimerStateManagementUsecaseDto,
  TenantNotFoundException,
  TimerNotFoundException,
} from 'src/core/domain';
import { TimerSchedulerService } from 'src/core/infrastructure';
import {
  DrizzleTenantRepository,
  DrizzleTimerRepository,
} from 'src/shared/database';

@Injectable()
export class StartTimerUseCase {
  constructor(
    private readonly tenantRepository: DrizzleTenantRepository,
    private readonly timerRepository: DrizzleTimerRepository,
    private readonly timerSchedulerService: TimerSchedulerService,
  ) {}

  async startTimer({ tenantCode, timerId }: TimerStateManagementUsecaseDto) {
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

    timer.start();

    await this.timerRepository.update(timer);

    this.timerSchedulerService.startTimer(timer);
  }
}
