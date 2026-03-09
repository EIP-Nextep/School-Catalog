import { Module } from '@nestjs/common';
import { CatalogService } from './app.service';
import { CatalogController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import 'dotenv/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
  ],
  providers: [CatalogService],
  controllers: [CatalogController],
})
export class CatalogModule {}
