import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupGlobalFilters, setupSwagger } from './main/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupGlobalFilters(app);
  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
