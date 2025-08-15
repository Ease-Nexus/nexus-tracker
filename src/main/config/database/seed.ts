import 'dotenv/config'; // loads .env into process.env

import { db } from './db';
import { tableBadges } from './schema';

const main = async () => {
  console.log('running seed');

  const badgesToBeAdded: Array<typeof tableBadges.$inferInsert> = [];
  for (let index = 1; index <= 150; index++) {
    badgesToBeAdded.push({
      badgeValue: index.toString(),
      description: `Badge ${index}`,
      enabled: true,
    });
  }

  await db.insert(tableBadges).values(badgesToBeAdded).execute();
};

void main();
