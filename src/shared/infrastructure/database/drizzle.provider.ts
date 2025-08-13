import { Provider } from '@nestjs/common';
import { db } from 'src/main/config/database/db';

export const DRIZZLE = Symbol('DRIZZLE');

export const DrizzleProvider: Provider = {
  provide: DRIZZLE,
  useFactory: () => {
    return db;
  },
};
