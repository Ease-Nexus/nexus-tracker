import { defineConfig } from 'drizzle-kit';
import { env } from 'src/main/config/env';

export default defineConfig({
  out: './drizzle',
  schema: './src/main/config/database/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.databaseUrl,
  },
});
