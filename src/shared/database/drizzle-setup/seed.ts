import 'dotenv/config'; // loads .env into process.env
import { v4 as uuid } from 'uuid';
import { db } from './client';
import { badgesTable } from './schema';

const main = async () => {
  console.log('running seed');

  const badgesToBeAdded: Array<typeof badgesTable.$inferInsert> = [];
  for (let index = 1; index <= 150; index++) {
    badgesToBeAdded.push({
      tenantId: uuid(),
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
