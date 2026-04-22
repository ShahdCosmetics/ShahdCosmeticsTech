import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Reflector } from '@nestjs/core';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';

describe('AdminController', () => {
  let adminController: AdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    adminController = module.get<AdminController>(AdminController);
  });

  describe('getDashboard', () => {
    it('should return the dashboard message for an authenticated SUPER_ADMIN', () => {
      expect(adminController.getDashboard()).toEqual({
        message: 'Welcome to the Admin Dashboard',
      });
    });
  });
});

describe('JwtAuthGuard', () => {
  let jwtAuthGuard: JwtAuthGuard;

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  beforeEach(() => {
    jwtAuthGuard = new JwtAuthGuard(mockJwtService as any);
    jest.clearAllMocks();
  });

  const buildMockExecutionContext = (authHeader?: string): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: authHeader },
        }),
      }),
    }) as unknown as ExecutionContext;

  it('should throw UnauthorizedException when no token is provided', async () => {
    const context = buildMockExecutionContext(undefined);

    await expect(jwtAuthGuard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException when the token is invalid', async () => {
    mockJwtService.verifyAsync.mockRejectedValue(new Error('invalid token'));
    const context = buildMockExecutionContext('Bearer bad-token');

    await expect(jwtAuthGuard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should allow the request and attach user when token is valid', async () => {
    const mockPayload = { sub: 'user-id', email: 'admin@example.com', role: 'SUPER_ADMIN' };
    mockJwtService.verifyAsync.mockResolvedValue(mockPayload);

    const mockRequest: any = { headers: { authorization: 'Bearer valid-token' } };
    const context = {
      switchToHttp: () => ({ getRequest: () => mockRequest }),
    } as unknown as ExecutionContext;

    const result = await jwtAuthGuard.canActivate(context);

    expect(result).toBe(true);
    expect(mockRequest.user).toEqual(mockPayload);
  });
});

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    rolesGuard = new RolesGuard(reflector);
  });

  const buildMockExecutionContext = (role?: string): ExecutionContext =>
    ({
      getHandler: () => ({}),
      getClass: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({ user: role ? { role } : undefined }),
      }),
    }) as unknown as ExecutionContext;

  it('should allow access when no roles are required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(null);
    const context = buildMockExecutionContext();

    expect(rolesGuard.canActivate(context)).toBe(true);
  });

  it('should allow access when user has the required SUPER_ADMIN role', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['SUPER_ADMIN']);
    const context = buildMockExecutionContext('SUPER_ADMIN');

    expect(rolesGuard.canActivate(context)).toBe(true);
  });

  it('should throw ForbiddenException when a CUSTOMER tries to access an admin route', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['SUPER_ADMIN']);
    const context = buildMockExecutionContext('CUSTOMER');

    expect(() => rolesGuard.canActivate(context)).toThrow(ForbiddenException);
  });
});