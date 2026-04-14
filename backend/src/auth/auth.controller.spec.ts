import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

/**
 * Controller tests only verify that the controller correctly
 * delegates to the service. Business logic is tested in auth.service.spec.ts.
 */
describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(() => {
    // We mock the entire AuthService so the controller
    // is tested in complete isolation.
    authService = {
      registerNewUser: jest.fn(),
      loginUser: jest.fn(),
    } as unknown as AuthService;

    authController = new AuthController(authService);
  });

  it('should call registerNewUser and return success message', async () => {
    const expectedResult = { message: 'User registered successfully' };
    (authService.registerNewUser as jest.Mock).mockResolvedValue(expectedResult);

    const result = await authController.register({
      email: 'new@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    });

    expect(authService.registerNewUser).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResult);
  });

  it('should call loginUser and return an accessToken', async () => {
    const expectedResult = { accessToken: 'signed-jwt-token' };
    (authService.loginUser as jest.Mock).mockResolvedValue(expectedResult);

    const result = await authController.login({
      email: 'user@example.com',
      password: 'password123',
    });

    expect(authService.loginUser).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResult);
  });
});