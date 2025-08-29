import { Timer } from 'src/core';
import { timersTable } from '../../drizzle-setup';

export type TimerPersistence = typeof timersTable.$inferSelect;

export class TimerMapper {
  static toDomain(timer: TimerPersistence) {
    return Timer.create({
      tenantId: timer.tenantId,
      sessionId: timer.sessionId,
      duration: timer.duration,
      elapsed: timer.elapsed,
      status: timer.status,
      lastStartedAt: timer.lastStartedAt ?? undefined,
      startedAt: timer.startedAt ?? undefined,
      history: timer.history.map((h) => ({
        start: new Date(h.start),
        end: h.end ? new Date(h.end) : undefined,
        elapsed: h.elapsed,
      })),
    });
  }
}
