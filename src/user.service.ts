import { Injectable } from '@nestjs/common';

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
};

@Injectable()
export class UserService {
  private users: User[] = [];

  getUsers(): User[] {
    return this.users;
  }

  createUser(user: Omit<User, 'id'>): User {
    const newUser: User = {
      ...user,
      id: this.users.length + 1,
    };

    this.users.push(newUser);
    return newUser;
  }

  updateUser(id: number, user: User): User {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }
    this.users[index] = user;
    return this.users[index];
  }

  deleteUser(id: number): void {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }
    this.users.splice(index, 1);
  }
}
