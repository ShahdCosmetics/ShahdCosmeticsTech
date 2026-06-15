import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma.service';
import { AdminController } from './admin.controller';
import { AdminOrdersController } from './orders/admin-orders.controller';
import { AdminOrdersService } from './orders/admin-orders.service';

/**
 * AuthModule is imported (instead of registering JwtModule directly) because
 * it exports JwtModule, JwtAuthGuard, and RolesGuard. That gives every
 * controller here the JWT verification + role checking the guards need,
 * in one line, without re-registering JwtService.
 */
@Module({
  imports: [AuthModule],
  controllers: [AdminController, AdminOrdersController],
  providers: [AdminOrdersService, PrismaService],
})
export class AdminModule {}