import { Timer, TimerStatus } from 'src/timers/domain';

export interface HistoryDto {
  startedAt: Date;
  endedAt?: Date;
  elapsed: number;
}

export interface TimerResultDto {
  id: string;
  badge: string;
  duration: number;
  elapsed: number;
  status: TimerStatus;
  startedAt?: Date;
  lastStartedAt?: Date;
  overDue?: number;
  history: HistoryDto[];
}

export const mapToTimerResultDto = (timer: Timer): TimerResultDto => {
  const overDue = Math.max(timer.elapsed - timer.duration, 0);

  return {
    id: timer.id,
    badge: timer.badge.badgeValue,
    status: timer.status,
    duration: timer.duration,
    elapsed: timer.elapsed,
    startedAt: timer.startedAt,
    lastStartedAt: timer.lastStartedAt,
    overDue: overDue > 0 ? overDue : undefined,
    history: timer.history.map((block) => ({
      startedAt: block.start,
      endedAt: block.end,
      elapsed: block.elapsed,
    })),
  };
};
