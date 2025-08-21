import { Badge, Tenant } from 'src/modules/management';
import { tenantsTable, badgesTable } from '../../drizzle-setup/schema';

export interface BadgePersistence {
  tenants: typeof tenantsTable.$inferSelect;
  badges: typeof badgesTable.$inferSelect;
}

export class BadgeMapper {
  static toDomain(raw: BadgePersistence): Badge {
    const { badges, tenants } = raw;
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
      },
      badges.id,
    );
  }
}
