import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

/**
 * We mock PrismaService and JwtService entirely so tests never
 * touch a real database or generate real tokens.
 */
const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  userProfile: {
    create: jest.fn(),
  },
  $transaction: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);

    // Reset all mocks before each test to prevent state leaking between tests.
    jest.clearAllMocks();
  });

  // ─────────────────────────────────────────────
  // registerNewUser
  // ─────────────────────────────────────────────

  describe('registerNewUser', () => {
    it('should throw ConflictException if email already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'existing-id' });

      await expect(
        authService.registerNewUser({
          email: 'taken@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should create a user and profile and return success message', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // Simulate the transaction executing the callback immediately.
      mockPrismaService.$transaction.mockImplementation(
        async (callback: (tx: typeof mockPrismaService) => Promise<void>) =>
          callback(mockPrismaService),
      );

      mockPrismaService.user.create.mockResolvedValue({ id: 'new-user-id' });
      mockPrismaService.userProfile.create.mockResolvedValue({});

      const result = await authService.registerNewUser({
        email: 'new@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(result).toEqual({ message: 'User registered successfully' });
      expect(mockPrismaService.$transaction).toHaveBeenCalledTimes(1);
    });
  });

  // ─────────────────────────────────────────────
  // loginUser
  // ─────────────────────────────────────────────

  describe('loginUser', () => {
    it('should throw UnauthorizedException if user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        authService.loginUser({
          email: 'ghost@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is wrong', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-id',
        email: 'user@example.com',
        passwordHash: await bcrypt.hash('correctpassword', 12),
      });

      await expect(
        authService.loginUser({
          email: 'user@example.com',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return an accessToken on valid credentials', async () => {
      const rawPassword = 'password123';
      const passwordHash = await bcrypt.hash(rawPassword, 12);

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-id',
        email: 'user@example.com',
        passwordHash,
      });

      mockJwtService.signAsync.mockResolvedValue('signed-jwt-token');

      const result = await authService.loginUser({
        email: 'user@example.com',
        password: rawPassword,
      });

      expect(result).toEqual({ accessToken: 'signed-jwt-token' });
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: 'user-id',
        email: 'user@example.com',
      });
    });
  });
});