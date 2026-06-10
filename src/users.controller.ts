import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import type { User } from './user.service';
import { UserService } from './user.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  getUsers(): User[] {
    return this.usersService.getUsers();
  }

  @Post()
  createUser(@Body() user: Omit<User, 'id'>): User {
    return this.usersService.createUser(user);
  }

  @Put(':id')
  updateUser(@Param('id') id: number, @Body() user: User): User {
    return this.usersService.updateUser(id, user);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number): void {
    console.log('deleteUser', id);
    return this.usersService.deleteUser(id);
  }
}
