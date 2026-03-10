import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { CatalogModule } from './app.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(CatalogModule);

  app.use(helmet());

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Catalog API')
    .setDescription('The NextEp Catalog API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT || 3005);
}

bootstrap();
