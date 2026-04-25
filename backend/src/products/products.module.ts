import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule], // PrismaModule does not exist — PrismaService injected directly
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService],
})
export class ProductsModule {}