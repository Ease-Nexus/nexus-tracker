export const timerStatuses = [
  'CREATED',
  'RUNNING',
  'PAUSED',
  'COMPLETED',
  'CANCELED',
] as const;

export type TimerStatus = (typeof timerStatuses)[number];
