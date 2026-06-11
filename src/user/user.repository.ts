import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpDTO } from 'src/auth/dtos/auth';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByEmail(email: string) {
    return await this.prismaService.user.findUnique({ where: { email } });
  }

  async create(data: SignUpDTO) {
    return await this.prismaService.user.create({ data });
  }

  async findAll() {
    return await this.prismaService.user.findMany();
  }

  async findById(id: string) {
    return await this.prismaService.user.findUnique({ where: { id } });
  }

  async update(id: string, data: SignUpDTO) {
    return await this.prismaService.user.update({ where: { id }, data });
  }

  async remove(id: string) {
    return await this.prismaService.user.delete({ where: { id } });
  }
}
