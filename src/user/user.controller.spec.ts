import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let userService: jest.Mocked<Pick<UserService, 'findAll' | 'findById'>>;

  const storedUserResponse = {
    id: 'user-id',
    name: 'Test User',
    email: 'test@example.com',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(async () => {
    userService = {
      findAll: jest.fn(),
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: userService }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UserController>(UserController);
  });

  describe('findAll', () => {
    it('delegates to UserService.findAll', async () => {
      userService.findAll.mockResolvedValue([storedUserResponse] as never);

      await expect(controller.findAll()).resolves.toEqual([storedUserResponse]);
      expect(userService.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('delegates to UserService.findById', async () => {
      userService.findById.mockResolvedValue(storedUserResponse as never);

      await expect(controller.findById(storedUserResponse.id)).resolves.toEqual(
        storedUserResponse,
      );
      expect(userService.findById).toHaveBeenCalledWith(storedUserResponse.id);
    });
  });
});
