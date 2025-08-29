import { Timer } from 'src/core';
import { sessionsTable, tenantsTable, timersTable } from '../../drizzle-setup';
import { TenantMapper } from './tenant-mapper';
import { SessionMapper } from './session-mapper';

export type TimerPersistence = {
  timer: typeof timersTable.$inferSelect;
  tenant?: typeof tenantsTable.$inferSelect;
  session?: typeof sessionsTable.$inferSelect;
};

export class TimerMapper {
  static toDomain({ timer, session, tenant }: TimerPersistence): Timer {
    return Timer.create(
      {
        tenantId: timer.tenantId,
        sessionId: timer.sessionId,
        duration: timer.duration,
        elapsed: timer.elapsed,
        history: timer.history.map((h) => ({
          start: new Date(h.start),
          end: h.end ? new Date(h.end) : undefined,
          elapsed: h.elapsed,
        })),
        status: timer.status,
        startedAt: timer.startedAt ?? undefined,
        lastStartedAt: timer.lastStartedAt ?? undefined,
        tenant: tenant ? TenantMapper.toDomain({ tenant }) : undefined,
        session: session ? SessionMapper.toDomain({ session }) : undefined, // Handle optional session data
      },
      timer.id,
    );
  }
}
