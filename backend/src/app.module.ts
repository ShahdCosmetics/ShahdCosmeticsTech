import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';

/**
 * AdminModule is registered here to make the admin routes
 * available across the application.
 */

/**
 * AuthModule is imported here to register all auth routes
 * and make the JWT strategy available across the application.
 */
@Module({
  imports: [AuthModule, AdminModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}