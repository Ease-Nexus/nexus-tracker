import { Badge } from 'src/core/domain';
import { tenantsTable, badgesTable, sessionsTable } from '../../drizzle-setup/schema';
import { TenantMapper } from './tenant-mapper';
import { SessionMapper } from './session-mapper';

export interface BadgePersistence {
  badge: typeof badgesTable.$inferSelect;
  tenant?: typeof tenantsTable.$inferSelect;
  session?: typeof sessionsTable.$inferSelect | null; // Optional, in case session data is not always present
}

export class BadgeMapper {
  static toDomain(raw: BadgePersistence): Badge {
    const { badge, tenant, session } = raw;
    return Badge.create(
      {
        tenantId: badge.tenantId,
        badgeType: badge.badgeType,
        badgeValue: badge.badgeValue,
        isFixed: badge.isFixed,
        enabled: badge.enabled,
        description: badge.description,
        tenant: tenant ? TenantMapper.toDomain({ tenant }) : undefined,
        session: session ? SessionMapper.toDomain({ session }) : undefined, // Handle optional session data
      },
      badge.id,
    );
  }
}
