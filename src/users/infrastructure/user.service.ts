import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UserRepository } from './user.repository';
import { hash } from 'bcrypt';
import { CreateUserDTO, UpdateUserDTO } from './dto/user.dto';
import { UserResponseShape } from './user.types';
import { toUserResponse, toUserResponseList } from './user.mapper';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(data: CreateUserDTO): Promise<UserResponseShape> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new UnauthorizedException('Usuário já existe');
    }

    const hashedPassword = await hash(data.password, 10);
    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    return toUserResponse(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async findAll(): Promise<UserResponseShape[]> {
    const users = await this.userRepository.findAll();
    return toUserResponseList(users);
  }

  async findById(id: string): Promise<UserResponseShape> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return toUserResponse(user);
  }

  async update(id: string, data: UpdateUserDTO): Promise<UserResponseShape> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const user = await this.userRepository.update(id, {
      name: data.name ?? existingUser.name,
      email: data.email ?? existingUser.email,
      password: data.password
        ? await hash(data.password, 10)
        : existingUser.password,
    });

    return toUserResponse(user);
  }

  async remove(id: string): Promise<UserResponseShape> {
    const user = await this.userRepository.remove(id);
    return toUserResponse(user);
  }
}
