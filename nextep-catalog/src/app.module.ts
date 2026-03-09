import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CatalogController } from './app.controller';
import { CatalogService } from './app.service';
import { AuthGuard } from './app.guard';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET, 
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [CatalogController],
  providers: [CatalogService, PrismaService, AuthGuard],
})
export class CatalogModule {}