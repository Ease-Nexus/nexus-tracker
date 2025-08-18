import 'dotenv/config'; // loads .env into process.env
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']),
  DEBUG: z.enum(['true', 'false']),
  DATABASE_URL: z.string(),
});

const result = envSchema.parse(process.env);

export const env = {
  databaseUrl: result.DATABASE_URL,
  nodeEnv: result.NODE_ENV,
  debug: result.DEBUG === 'true',
};
