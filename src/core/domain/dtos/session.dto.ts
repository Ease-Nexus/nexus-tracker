export interface SessionsGetAllParamsDto {
  tenantId: string;
  isOpen: boolean;
}

export interface SessionsGetByIdParamsDto {
  tenantId: string;
  id: string;
}

export type SessionsEndParams = SessionsGetByIdParamsDto;

export class StartSessionDto {
  customerId?: string;
  badgeValue: string;
  duration: number;
  startImmediately?: boolean;
}
