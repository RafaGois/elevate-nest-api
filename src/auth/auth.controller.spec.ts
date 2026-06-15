import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<Pick<AuthService, 'signin' | 'signup'>>;

  const signUpData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  };

  const signInData = {
    email: 'test@example.com',
    password: 'password123',
  };

  beforeEach(async () => {
    authService = {
      signin: jest.fn(),
      signup: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('signup', () => {
    it('delegates to AuthService.signup', async () => {
      const createdUser = {
        id: '1',
        name: signUpData.name,
        email: signUpData.email,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      };
      authService.signup.mockResolvedValue(createdUser as never);

      await expect(controller.signup(signUpData)).resolves.toEqual(createdUser);
      expect(authService.signup).toHaveBeenCalledWith(signUpData);
    });
  });

  describe('signin', () => {
    it('delegates to AuthService.signin', async () => {
      const signinResult = { ...signInData, token: 'jwt-token' };
      authService.signin.mockResolvedValue(signinResult);

      await expect(controller.signin(signInData)).resolves.toEqual(signinResult);
      expect(authService.signin).toHaveBeenCalledWith(signInData);
    });
  });
});
