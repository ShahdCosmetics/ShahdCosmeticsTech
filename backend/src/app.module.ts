import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';

/**
 * AuthModule registers all auth routes and makes JWT strategy available.
 * AdminModule registers admin-only routes protected by RBAC guards.
 * CategoriesModule registers the product category CRUD endpoints.
 * ProductsModule registers the product catalogue CRUD endpoints.
 */
@Module({
  imports: [AuthModule, AdminModule, CategoriesModule, ProductsModule, CartModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}