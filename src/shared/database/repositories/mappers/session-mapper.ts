import { Session } from 'src/core';
import { badgesTable, sessionsTable, tenantsTable } from '../../drizzle-setup';
import { BadgeMapper } from './badge-mapper';
import { TenantMapper } from './tenant-mapper';

export type SessionPersistence = {
  session: typeof sessionsTable.$inferSelect;
  tenant?: typeof tenantsTable.$inferSelect;
  badge?: typeof badgesTable.$inferSelect;
};

export class SessionMapper {
  static toDomain({ session, tenant, badge }: SessionPersistence) {
    return Session.create(
      {
        tenantId: session.tenantId,
        customerId: session.customerId ?? undefined,
        badgeId: session.badgeId,
        startedAt: session.startedAt ?? undefined,
        endedAt: session.endedAt ?? undefined,
        tenant: tenant ? TenantMapper.toDomain({ tenant }) : undefined,
        badge: badge ? BadgeMapper.toDomain({ badge }) : undefined,
      },
      session.id,
    );
  }
}
