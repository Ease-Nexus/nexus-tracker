import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from '../global';

export const setupGlobalFilters = (app: INestApplication<any>) => {
  const configService = app.get(ConfigService);

  app.useGlobalFilters(new HttpExceptionFilter(configService));
};
