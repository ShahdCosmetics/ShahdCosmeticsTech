import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service'; // Yeni ekledik

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PrismaService], // PrismaService'i buraya ekle
})
export class AppModule {}