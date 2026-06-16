import { User } from '@prisma/client';
import { UserResponseShape } from './user.types';

export function toUserResponse(user: User): UserResponseShape {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function toUserResponseList(users: User[]): UserResponseShape[] {
  return users.map(toUserResponse);
}
