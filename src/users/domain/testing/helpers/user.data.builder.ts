import { faker } from '@faker-js/faker';
import { UserEntityProps } from '../../entities/user.entity';

type Props = {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
};

export function UserDataBuilder(props: Props): UserEntityProps {
  return {
    id: props.id ?? faker.string.uuid(),
    name: props.name ?? faker.person.fullName(),
    email: props.email ?? faker.internet.email(),
    password: props.password ?? faker.internet.password(),
  };
}
