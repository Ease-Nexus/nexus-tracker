export interface SessionsGetAllParamsDto {
  tenantCode: string;
}

export interface SessionsGetByIdParamsDto {
  tenantCode: string;
  id: string;
}

export type SessionsEndParams = SessionsGetByIdParamsDto;

export interface StartSessionDto {
  customerId?: string;
  badge: string;
  duration: number;
  startImmediately?: boolean;
}
