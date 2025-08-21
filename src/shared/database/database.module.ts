import { Provider } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { db } from './drizzle-setup';
import { databaseSymbols } from './database-symbols';
import { DatabaseProviders } from './database-providers';

export const DrizzleProvider: Provider = {
  provide: databaseSymbols.DRIZLE_DB,
  useFactory: () => {
    return db;
  },
};

@Module({
  providers: [DrizzleProvider, ...DatabaseProviders],
  exports: [DrizzleProvider, ...DatabaseProviders],
})
export class DatabaseModule {}
