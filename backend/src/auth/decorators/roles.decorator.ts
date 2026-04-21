import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

/**
 * The key used to store and retrieve role metadata on a route handler.
 * Exported so the RolesGuard can read it without magic strings.
 */
export const ROLES_KEY = 'roles';

/**
 * Attaches the required roles to a route as metadata.
 * The RolesGuard reads this metadata to decide if the
 * requesting user is authorized.
 * 
 * Usage: @Roles(Role.SUPER_ADMIN)
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);