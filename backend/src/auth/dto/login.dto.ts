import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * Defines and validates the shape of the login request body.
 */
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}