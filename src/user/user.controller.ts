import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dtos/user';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  async findAll(): Promise<UserDTO[]> {
    return await this.userService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<UserDTO | null> {
    return await this.userService.findById(id);
  }
}
