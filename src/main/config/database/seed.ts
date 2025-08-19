import 'dotenv/config'; // loads .env into process.env

import { db } from './client';
import { badgesTable } from './schema-bkp';

const main = async () => {
  console.log('running seed');

  const badgesToBeAdded: Array<typeof badgesTable.$inferInsert> = [];
  for (let index = 1; index <= 150; index++) {
    badgesToBeAdded.push({
      badgeValue: index.toString(),
      description: `Badge ${index}`,
      enabled: true,
    });
  }

  await db.insert(badgesTable).values(badgesToBeAdded).execute();
};

void main();
