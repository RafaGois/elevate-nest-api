import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

type UserPersistenceData = Pick<User, 'name' | 'email' | 'password'>;

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.prismaService.user.findUnique({ where: { email } });
  }

  async create(data: UserPersistenceData): Promise<User> {
    return await this.prismaService.user.create({ data });
  }

  async findAll(): Promise<User[]> {
    return await this.prismaService.user.findMany();
  }

  async findById(id: string): Promise<User | null> {
    return await this.prismaService.user.findUnique({ where: { id } });
  }

  async update(id: string, data: UserPersistenceData): Promise<User> {
    return await this.prismaService.user.update({ where: { id }, data });
  }

  async remove(id: string): Promise<User> {
    return await this.prismaService.user.delete({ where: { id } });
  }
}
