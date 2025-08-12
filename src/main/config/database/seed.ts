import 'dotenv/config'; // loads .env into process.env

import { db } from './db';
import { badges } from './schema';

const main = async () => {
  console.log('running seed');

  const badgesToBeAdded: Array<typeof badges.$inferInsert> = [];
  for (let index = 1; index <= 20; index++) {
    badgesToBeAdded.push({
      badgeValue: index.toString(),
      description: `Badge ${index}`,
      enabled: true,
    });
  }

  await db.insert(badges).values(badgesToBeAdded).execute();
};

void main();
