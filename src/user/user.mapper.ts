import { UserDTO, UserResponseDTO } from './dtos/user.dto';

export function toUserResponse(user: UserDTO): UserResponseDTO {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function toUserResponseList(users: UserDTO[]): UserResponseDTO[] {
  return users.map(toUserResponse);
}
