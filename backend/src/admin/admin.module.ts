import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminController } from './admin.controller';

/**
 * JwtModule is imported here so JwtAuthGuard can access
 * JwtService via Dependency Injection within this module.
 */
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AdminController],
})
export class AdminModule {}