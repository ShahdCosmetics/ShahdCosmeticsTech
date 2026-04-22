import { SetMetadata } from '@nestjs/common';

/**
 * The key used to store and retrieve role metadata on a route handler.
 * Exported so the RolesGuard can read it without magic strings.
 */
export const ROLES_KEY = 'roles';

/**
 * Accepts plain strings instead of a Role enum so new roles can be
 * added to the database without requiring code changes.
 * 
 * Usage: @Roles('SUPER_ADMIN')
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);