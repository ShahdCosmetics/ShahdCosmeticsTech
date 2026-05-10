import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  // AuthModule is imported so JwtAuthGuard has access to JwtService
  imports: [AuthModule],
  controllers: [CartController],
  providers: [CartService, PrismaService],
})
export class CartModule {}