import { Pool } from 'pg';
import { env } from '../env';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

const pool = new Pool({
  connectionString: env.databaseUrl,
});

export const db = drizzle(pool, { schema });

export type DrizzleDatabase = typeof db;
