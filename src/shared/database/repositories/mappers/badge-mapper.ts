import { Badge, Session, Tenant } from 'src/core/domain';
import {
  tenantsTable,
  badgesTable,
  sessionsTable,
} from '../../drizzle-setup/schema';

export interface BadgePersistence {
  tenants: typeof tenantsTable.$inferSelect;
  badges: typeof badgesTable.$inferSelect;
  sessions?: typeof sessionsTable.$inferSelect | null; // Optional, in case session data is not always present
}

export class BadgeMapper {
  static toDomain(raw: BadgePersistence): Badge {
    const { badges, tenants, sessions } = raw;
    return Badge.create(
      {
        tenantId: tenants.id,
        tenant: Tenant.create(
          {
            code: tenants.code,
            name: tenants.name,
            description: tenants.description ?? undefined,
            contactInfo: tenants.contactInfo ?? undefined,
            createdAt: tenants.createdAt,
          },
          tenants.id,
        ),
        badgeType: badges.badgeType,
        badgeValue: badges.badgeValue,
        isFixed: badges.isFixed,
        enabled: badges.enabled,
        description: badges.description,
        session: sessions
          ? Session.create(
              {
                tenantCode: sessions.tenantId,
                badgeId: sessions.badgeId,
                startedAt: sessions.startedAt ?? undefined,
                endedAt: sessions.endedAt ?? undefined,
                customerId: sessions.customerId ?? undefined,
              },
              sessions.id,
            )
          : undefined, // Handle optional session data
      },
      badges.id,
    );
  }
}
