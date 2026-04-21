/**
 * Defines the possible roles a user can hold in the system.
 * Stored as a database table (not a Prisma enum) so new roles
 * can be added without requiring a new migration.
 */


export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  VENDOR_ADMIN = 'VENDOR_ADMIN',
  CUSTOMER = 'CUSTOMER',
}