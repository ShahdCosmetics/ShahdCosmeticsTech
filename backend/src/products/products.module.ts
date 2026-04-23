import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from '../prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule], // AuthModule needed for guards
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}