import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserEntityProps } from '../entities/user.entity';
import { ClassValidatorFields } from '@/shared/domain/validators/class-validator-fields';

export class UserRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  @IsDate()
  @IsOptional()
  createdAt: Date;

  @IsDate()
  @IsOptional()
  updatedAt: Date;

  constructor({
    name,
    email,
    password,
    createdAt,
    updatedAt,
  }: UserEntityProps) {
    Object.assign(this, { name, email, password, createdAt, updatedAt });
  }
}

export class UserValidator extends ClassValidatorFields<UserRules> {
  validate(data: UserEntityProps): boolean {
    return super.validate(new UserRules(data ?? ({} as UserEntityProps)));
  }
}

export class UserValidatorFactory {
  static create(): UserValidator {
    return new UserValidator();
  }
}
