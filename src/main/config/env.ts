import 'dotenv/config'; // loads .env into process.env
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string(),
});

const result = envSchema.parse(process.env);

export const env = {
  databaseUrl: result.DATABASE_URL,
};
