import { Tenant } from 'src/core';
import { tenantsTable } from '../../drizzle-setup';

export type TenantPersistence = {
  tenant: typeof tenantsTable.$inferSelect;
};

export class TenantMapper {
  static toDomain({ tenant }: TenantPersistence): Tenant {
    return Tenant.create(
      {
        code: tenant.code,
        name: tenant.name,
        createdAt: tenant.createdAt,
        contactInfo: tenant.contactInfo ?? undefined,
        description: tenant.description ?? undefined,
      },
      tenant.id,
    );
  }
}
