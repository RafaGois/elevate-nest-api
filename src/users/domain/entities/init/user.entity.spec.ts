import { UserEntity, UserEntityProps } from '../user.entity';
import { faker } from '@faker-js/faker';
describe('UserEntity', () => {
  let sut: UserEntity;
  let props: UserEntityProps;

  beforeEach(() => {
    props = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
  });

  it('constructor method', () => {
    sut = new UserEntity(props);

    expect(sut.props.name).toBe(props.name);
    expect(sut.props.email).toBe(props.email);
    expect(sut.props.password).toBe(props.password);
    expect(sut.props.createdAt).toBeInstanceOf(Date);
    expect(sut.props.updatedAt).toBeInstanceOf(Date);
  });
});
