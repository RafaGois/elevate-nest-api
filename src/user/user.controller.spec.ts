import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let userService: jest.Mocked<Pick<UserService, 'findAll' | 'findById'>>;

  const storedUser = {
    id: 'user-id',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashed-password',
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
      userService.findAll.mockResolvedValue([storedUser] as never);

      await expect(controller.findAll()).resolves.toEqual([storedUser]);
      expect(userService.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('delegates to UserService.findById', async () => {
      userService.findById.mockResolvedValue(storedUser as never);

      await expect(controller.findById(storedUser.id)).resolves.toEqual(
        storedUser,
      );
      expect(userService.findById).toHaveBeenCalledWith(storedUser.id);
    });
  });
});
