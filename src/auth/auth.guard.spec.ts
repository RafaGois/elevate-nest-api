import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { constants } from './constants';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: jest.Mocked<Pick<JwtService, 'verifyAsync'>>;

  const createContext = (authorization?: string): ExecutionContext => {
    const request: Record<string, unknown> = {
      headers: authorization ? { authorization } : {},
    };

    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext;
  };

  beforeEach(async () => {
    jwtService = {
      verifyAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
  });

  it('throws when token is missing', async () => {
    await expect(guard.canActivate(createContext())).rejects.toThrow(
      new UnauthorizedException('Token não encontrado'),
    );
  });

  it('throws when token is invalid', async () => {
    jwtService.verifyAsync.mockRejectedValue(new Error('invalid'));

    await expect(
      guard.canActivate(createContext('Bearer invalid-token')),
    ).rejects.toThrow(new UnauthorizedException('Token inválido'));
  });

  it('allows access and attaches user when token is valid', async () => {
    const payload = { email: 'test@example.com' };
    jwtService.verifyAsync.mockResolvedValue(payload);

    const context = createContext('Bearer valid-token');

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid-token', {
      secret: constants.secret,
    });
    expect(context.switchToHttp().getRequest()['user']).toEqual(payload);
  });
});
