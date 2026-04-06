import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

/**
 * Defines and validates the shape of the registration request body.
 * firstName and lastName are here because they belong to UserProfile,
 * which we create atomically alongside the User record.
 */
export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(64)
  password: string;

  @IsString()
  @MaxLength(100)
  firstName: string;

  @IsString()
  @MaxLength(100)
  lastName: string;
}