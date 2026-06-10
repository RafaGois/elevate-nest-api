import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDTO, SignUpDTO } from './dtos/auth';
import { PrismaService } from '../prisma/prisma.service';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(data: SignUpDTO) {
    const existingUser = await this.prismaService.user.findFirst({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new UnauthorizedException('Usuário já existe');
    }

    const hashedPassword = await hash(data.password, 10);

    await this.prismaService.user.create({
      data: { ...data, password: hashedPassword },
    });
    return data;
  }

  async signin(data: SignInDTO): Promise<SignInDTO & { token: string }> {
    const existingUser = await this.prismaService.user.findFirst({
      where: { email: data.email },
    });
    if (!existingUser) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    const isPasswordValid = await compare(data.password, existingUser.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Senha incorreta');
    }
    const token = await this.jwtService.signAsync({
      email: existingUser.email,
    });

    return { ...data, token };
  }
}
