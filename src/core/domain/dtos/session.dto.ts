import { Tenant } from '../entities';

export interface SessionsGetAllParamsDto {
  tenantId: string;
  isOpen: boolean;
}

export interface SessionsGetByIdParamsDto {
  tenantId: string;
  id: string;
}

export interface SessionsEndParams {
  tenant?: Tenant;
  tenantCode: string;
  id: string;
  forceCompleteTimer?: boolean;
}

export class StartSessionDto {
  customerId?: string;
  badgeValue: string;
  duration: number;
  startImmediately?: boolean;
}
