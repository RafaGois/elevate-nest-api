import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDTO, SignUpDTO } from './auth/auth';
import { PrismaService } from '../prisma/prisma.service';
import { hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async signup(data: SignUpDTO) {
    const existingUser = await this.prismaService.user.findFirst({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await hash(data.password, 10);

    await this.prismaService.user.create({
      data: { ...data, password: hashedPassword },
    });
    return data;
  }

  async signin(data: SignInDTO) {
    const existingUser = await this.prismaService.user.findFirst({
      where: { email: data.email },
    });
    if (!existingUser) {
      throw new UnauthorizedException('User not found');
    }
    if (existingUser.password !== data.password) {
      throw new UnauthorizedException('Invalid password');
    }
    return 'Signin successful';
  }
}
