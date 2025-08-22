import 'dotenv/config'; // loads .env into process.env
import { v4 as uuid } from 'uuid';
import { db } from './client';
import { badgesTable, tenantsTable } from './schema';

const main = async () => {
  console.log('running seed');

  const tenant = await db
    .insert(tenantsTable)
    .values({
      id: uuid(),
      code: 'home',
      name: 'Home',
      createdAt: new Date(),
    })
    .onConflictDoUpdate({
      target: tenantsTable.code,
      set: {
        code: 'home',
        name: 'Home',
      },
    })
    .returning({
      id: tenantsTable.id,
    });

  const badgesToBeAdded: Array<typeof badgesTable.$inferInsert> = [];
  for (let index = 1; index <= 150; index++) {
    badgesToBeAdded.push({
      tenantId: tenant[0].id,
      badgeType: 'CARD',
      isFixed: false,
      badgeValue: index.toString(),
      description: `Badge ${index}`,
      enabled: true,
    });
  }

  await db.insert(badgesTable).values(badgesToBeAdded).execute();
};

void main();
