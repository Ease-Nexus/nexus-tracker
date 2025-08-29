import { Session } from 'src/core';
import {
  badgesTable,
  sessionsTable,
  tenantsTable,
  timersTable,
} from '../../drizzle-setup';
import { BadgeMapper } from './badge-mapper';
import { TenantMapper } from './tenant-mapper';
import { TimerMapper } from './timer-mapper';

export type SessionPersistence = {
  session: typeof sessionsTable.$inferSelect;
  tenant?: typeof tenantsTable.$inferSelect;
  badge?: typeof badgesTable.$inferSelect;
  timer?: typeof timersTable.$inferSelect | null;
};

export class SessionMapper {
  static toDomain({
    session,
    tenant,
    badge,
    timer,
  }: SessionPersistence): Session {
    return Session.create(
      {
        tenantId: session.tenantId,
        customerId: session.customerId ?? undefined,
        badgeId: session.badgeId,
        startedAt: session.startedAt ?? undefined,
        endedAt: session.endedAt ?? undefined,
        timer: timer ? TimerMapper.toDomain({ timer }) : undefined,
        tenant: tenant ? TenantMapper.toDomain({ tenant }) : undefined,
        badge: badge ? BadgeMapper.toDomain({ badge }) : undefined,
      },
      session.id,
    );
  }
}
