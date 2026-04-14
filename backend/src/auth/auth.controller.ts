import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

/**
 * Handles all authentication-related HTTP requests.
 * Validation of the request body is handled automatically
 * by NestJS ValidationPipe using our DTOs.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<{ message: string }> {
    return this.authService.registerNewUser(registerDto);
  }

  /**
   * @HttpCode(200) overrides NestJS's default 201 for POST requests.
   * Login does not create a resource — it returns a token, so 200 is correct.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.loginUser(loginDto);
  }
}