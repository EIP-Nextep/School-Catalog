import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { CatalogModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(CatalogModule);

  app.use(helmet());

  app.enableCors();
  await app.listen(process.env.PORT || 3005);
}

bootstrap();
