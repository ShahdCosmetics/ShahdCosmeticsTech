import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

/**
 * Number of bcrypt salt rounds. 12 is the industry standard balance
 * between security and performance. Too low = weak hash, too high = slow server.
 */
const BCRYPT_SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registers a new user by creating a User and UserProfile atomically.
   * Using a transaction ensures we never end up with a User record
   * that has no corresponding profile.
   */
  async registerNewUser(
    registerDto: RegisterDto,
  ): Promise<{ message: string }> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    const passwordHash = await bcrypt.hash(
      registerDto.password,
      BCRYPT_SALT_ROUNDS,
    );

    // A transaction guarantees both records are created or neither is.
    await this.prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: registerDto.email,
          passwordHash,
        },
      });

      await tx.userProfile.create({
        data: {
          userId: newUser.id,
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
        },
      });
    });

    return { message: 'User registered successfully' };
  }

  /**
   * Validates credentials and returns a signed JWT access token.
   * We intentionally return the same UnauthorizedException for both
   * "user not found" and "wrong password" to prevent user enumeration attacks.
   */
  async loginUser(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // The JWT payload is intentionally minimal — only what downstream
    // services need to identify the user without another DB call.
    const jwtPayload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(jwtPayload);

    return { accessToken };
  }
}