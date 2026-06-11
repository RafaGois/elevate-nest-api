import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { hash } from 'bcrypt';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<
    Pick<
      UserRepository,
      'findByEmail' | 'create' | 'findAll' | 'findById' | 'update' | 'remove'
    >
  >;

  const userData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  };

  const storedUser = {
    id: 'user-id',
    name: userData.name,
    email: userData.email,
    password: 'hashed-password',
  };

  beforeEach(async () => {
    userRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: userRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('creates a user with hashed password', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      (hash as jest.Mock).mockResolvedValue('hashed-password');
      userRepository.create.mockResolvedValue(storedUser as never);

      await expect(service.create(userData)).resolves.toEqual(storedUser);

      expect(hash).toHaveBeenCalledWith(userData.password, 10);
      expect(userRepository.create).toHaveBeenCalledWith({
        ...userData,
        password: 'hashed-password',
      });
    });

    it('throws when email already exists', async () => {
      userRepository.findByEmail.mockResolvedValue(storedUser as never);

      await expect(service.create(userData)).rejects.toThrow(
        new UnauthorizedException('Usuário já existe'),
      );
      expect(userRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findByEmail', () => {
    it('delegates to repository', async () => {
      userRepository.findByEmail.mockResolvedValue(storedUser as never);

      await expect(service.findByEmail(userData.email)).resolves.toEqual(
        storedUser,
      );
      expect(userRepository.findByEmail).toHaveBeenCalledWith(userData.email);
    });
  });

  describe('findAll', () => {
    it('delegates to repository', async () => {
      userRepository.findAll.mockResolvedValue([storedUser] as never);

      await expect(service.findAll()).resolves.toEqual([storedUser]);
      expect(userRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('delegates to repository', async () => {
      userRepository.findById.mockResolvedValue(storedUser as never);

      await expect(service.findById(storedUser.id)).resolves.toEqual(
        storedUser,
      );
      expect(userRepository.findById).toHaveBeenCalledWith(storedUser.id);
    });
  });

  describe('update', () => {
    it('updates a user with hashed password', async () => {
      const updatedUser = { ...storedUser, name: 'Updated User' };

      userRepository.findById.mockResolvedValue(storedUser as never);
      (hash as jest.Mock).mockResolvedValue('new-hashed-password');
      userRepository.update.mockResolvedValue(updatedUser as never);

      await expect(service.update(storedUser.id, userData)).resolves.toEqual(
        updatedUser,
      );

      expect(hash).toHaveBeenCalledWith(userData.password, 10);
      expect(userRepository.update).toHaveBeenCalledWith(storedUser.id, {
        ...userData,
        password: 'new-hashed-password',
      });
    });

    it('throws when user is not found', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(service.update('missing-id', userData)).rejects.toThrow(
        new UnauthorizedException('Usuário não encontrado'),
      );
      expect(userRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('delegates to repository', async () => {
      userRepository.remove.mockResolvedValue(storedUser as never);

      await expect(service.remove(storedUser.id)).resolves.toEqual(storedUser);
      expect(userRepository.remove).toHaveBeenCalledWith(storedUser.id);
    });
  });
});
