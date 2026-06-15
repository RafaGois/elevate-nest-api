import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserDTO } from './dtos/user.dto';

type UserPersistenceData = Pick<UserDTO, 'name' | 'email' | 'password'>;

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByEmail(email: string): Promise<UserDTO | null> {
    return await this.prismaService.user.findUnique({ where: { email } });
  }

  async create(data: UserPersistenceData): Promise<UserDTO> {
    return await this.prismaService.user.create({ data });
  }

  async findAll(): Promise<UserDTO[]> {
    return await this.prismaService.user.findMany();
  }

  async findById(id: string): Promise<UserDTO | null> {
    return await this.prismaService.user.findUnique({ where: { id } });
  }

  async update(id: string, data: UserPersistenceData): Promise<UserDTO> {
    return await this.prismaService.user.update({ where: { id }, data });
  }

  async remove(id: string): Promise<UserDTO> {
    return await this.prismaService.user.delete({ where: { id } });
  }
}
