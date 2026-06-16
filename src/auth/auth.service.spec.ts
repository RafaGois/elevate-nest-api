import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { compare } from 'bcrypt';
import { UserService } from '../users/infrastructure/user.service';
import { AuthService } from './auth.service';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let userService: jest.Mocked<Pick<UserService, 'findByEmail' | 'create'>>;
  let jwtService: jest.Mocked<Pick<JwtService, 'signAsync'>>;

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
    userService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('creates a user when email is not registered', async () => {
      const createdUser = { id: '1', ...signUpData, password: 'hashed' };

      userService.findByEmail.mockResolvedValue(null);
      userService.create.mockResolvedValue(createdUser as never);

      await expect(service.signup(signUpData)).resolves.toEqual(createdUser);
      expect(userService.findByEmail).toHaveBeenCalledWith(signUpData.email);
      expect(userService.create).toHaveBeenCalledWith(signUpData);
    });

    it('throws when email already exists', async () => {
      userService.findByEmail.mockResolvedValue({
        id: '1',
        ...signUpData,
        password: 'hashed',
      } as never);

      await expect(service.signup(signUpData)).rejects.toThrow(
        new UnauthorizedException('Usuário já existe'),
      );
      expect(userService.create).not.toHaveBeenCalled();
    });
  });

  describe('signin', () => {
    const storedUser = {
      id: '1',
      name: signUpData.name,
      email: signUpData.email,
      password: 'hashed-password',
    };

    it('returns token when credentials are valid', async () => {
      userService.findByEmail.mockResolvedValue(storedUser as never);
      (compare as jest.Mock).mockResolvedValue(true);
      jwtService.signAsync.mockResolvedValue('jwt-token');

      await expect(service.signin(signInData)).resolves.toEqual({
        ...signInData,
        token: 'jwt-token',
      });

      expect(compare).toHaveBeenCalledWith(
        signInData.password,
        storedUser.password,
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        email: storedUser.email,
      });
    });

    it('throws when user is not found', async () => {
      userService.findByEmail.mockResolvedValue(null);

      await expect(service.signin(signInData)).rejects.toThrow(
        new UnauthorizedException('Usuário não encontrado'),
      );
    });

    it('throws when password is incorrect', async () => {
      userService.findByEmail.mockResolvedValue(storedUser as never);
      (compare as jest.Mock).mockResolvedValue(false);

      await expect(service.signin(signInData)).rejects.toThrow(
        new UnauthorizedException('Senha incorreta'),
      );
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });
});
