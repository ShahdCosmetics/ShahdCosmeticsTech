import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { CategoriesModule } from './categories/categories.module';

/**
 * AuthModule registers all auth routes and makes JWT strategy available.
 * AdminModule registers admin-only routes protected by RBAC guards.
 * CategoriesModule registers the product category CRUD endpoints.
 */
@Module({
  imports: [AuthModule, AdminModule, CategoriesModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}