import { Entity } from '../../../shared/domain/entities/entity';
import { UserValidatorFactory } from '../valitators/user.validator';

export type UserEntityProps = {
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class UserEntity extends Entity<UserEntityProps> {
  constructor(
    public readonly props: UserEntityProps,
    id?: string,
  ) {
    UserEntity.validate(props);
    super(props, id);
    this.props.createdAt = this.props.createdAt ?? new Date();
    this.props.updatedAt = this.props.updatedAt ?? new Date();
  }

  update(props: Partial<UserEntityProps>) {
    UserEntity.validate({
      ...this.props,
      name: props.name ?? this.props.name,
      email: props.email ?? this.props.email,
    });
    this.props.name = props.name ?? this.props.name;
    this.props.email = props.email ?? this.props.email;
    this.props.updatedAt = new Date();
  }

  updatePassword(password: string) {
    UserEntity.validate({
      ...this.props,
      password: password,
    });
    this.props.password = password;
    this.props.updatedAt = new Date();
  }

  get name(): string {
    return this.props.name;
  }

  private set name(value: string) {
    this.props.name = value;
    this.props.updatedAt = new Date();
  }

  private set email(value: string) {
    this.props.email = value;
    this.props.updatedAt = new Date();
  }

  private set password(value: string) {
    this.props.password = value;
    this.props.updatedAt = new Date();
  }

  private set createdAt(value: Date) {
    this.props.createdAt = value;
  }

  private set updatedAt(value: Date) {
    this.props.updatedAt = value;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  static validate(props: UserEntityProps): void {
    const validator = UserValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new Error(JSON.stringify(validator.errors));
    }
  }
}
