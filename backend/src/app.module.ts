import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
/**
 * AuthModule is imported here to register all auth routes
 * and make the JWT strategy available across the application.
 */
@Module({
  imports: [AuthModule,CategoriesModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}