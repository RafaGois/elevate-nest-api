import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { SignUpDTO } from 'src/auth/dtos/auth';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(data: SignUpDTO) {
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new UnauthorizedException('Usuário já existe');
    }

    const hashedPassword = await hash(data.password, 10);
    return await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });
  }

  async findByEmail(email: string) {
    return await this.userRepository.findByEmail(email);
  }

  async findAll() {
    return await this.userRepository.findAll();
  }

  async findById(id: string) {
    return await this.userRepository.findById(id);
  }

  async update(id: string, data: SignUpDTO) {
    const existingUser = await this.findById(id);
    if (!existingUser) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const hashedPassword = await hash(data.password, 10);
    return await this.userRepository.update(id, {
      ...data,
      password: hashedPassword,
    });
  }

  async remove(id: string) {
    return await this.userRepository.remove(id);
  }
}
