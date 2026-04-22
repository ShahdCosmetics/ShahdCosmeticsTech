import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

/**
 * Handles all admin-only routes.
 * JwtAuthGuard runs first to verify the token, then RolesGuard
 * checks the role. Both must pass for the request to reach the handler.
 */
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  /**
   * A protected test endpoint to verify the RBAC guards are working.
   * Only accessible by SUPER_ADMIN role.
   */
  @Get('dashboard')
  @Roles('SUPER_ADMIN')
  getDashboard(): { message: string } {
    return { message: 'Welcome to the Admin Dashboard' };
  }
}