import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDTO, SignUpDTO } from './dtos/auth.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/infrastructure/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(data: SignUpDTO) {
    const existingUser = await this.userService.findByEmail(data.email);
    if (existingUser) {
      throw new UnauthorizedException('Usuário já existe');
    }

    return await this.userService.create({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  }

  async signin(data: SignInDTO): Promise<SignInDTO & { token: string }> {
    const existingUser = await this.userService.findByEmail(data.email);
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
