export interface StartSessionDto {
  customerId?: string;
  badge: string;
  duration: number;
  startImmediately?: boolean;
}
