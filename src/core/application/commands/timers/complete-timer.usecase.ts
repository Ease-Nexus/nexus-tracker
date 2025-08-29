import {
  Tenant,
  TenantNotFoundException,
  TimerNotFoundException,
  TimerStateManagementUsecaseDto,
} from 'src/core/domain';
import {
  DrizzleTenantRepository,
  DrizzleTimerRepository,
} from 'src/shared/database';

export class CompleteTimerUsecase {
  constructor(
    private readonly tenantRepository: DrizzleTenantRepository,
    private readonly timerRepository: DrizzleTimerRepository,
  ) {}

  private async validateTenant({
    tenantCode,
    tenant,
  }: TimerStateManagementUsecaseDto): Promise<Tenant> {
    if (tenant) return tenant;

    const tenantResult = await this.tenantRepository.getByCode(tenantCode);

    if (!tenantResult) {
      throw new TenantNotFoundException();
    }

    return tenantResult;
  }

  async complete(params: TimerStateManagementUsecaseDto) {
    const tenant = await this.validateTenant(params);
    const { timerId } = params;

    const timer = await this.timerRepository.getById({
      tenantId: tenant.id,
      timerId,
    });

    if (!timer) {
      throw new TimerNotFoundException();
    }

    timer.complete();

    await this.timerRepository.update(timer);
  }
}
