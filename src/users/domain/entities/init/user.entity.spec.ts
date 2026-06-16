import { UserDataBuilder } from '../../testing/helpers/user.data.builder';
import { UserEntity, UserEntityProps } from '../user.entity';

describe('UserEntity', () => {
  let sut: UserEntity;
  let props: UserEntityProps;

  beforeEach(() => {
    props = UserDataBuilder({});
    sut = new UserEntity(props);
  });

  it('constructor method', () => {
    sut = new UserEntity(props);

    expect(sut.props.name).toBe(props.name);
    expect(sut.props.email).toBe(props.email);
    expect(sut.props.password).toBe(props.password);
    expect(sut.props.createdAt).toBeInstanceOf(Date);
    expect(sut.props.updatedAt).toBeInstanceOf(Date);
  });

  it('getter of name field', () => {
    expect(sut.name).toBeDefined();
    expect(typeof sut.name).toBe('string');
    expect(sut.name.length).toBeGreaterThan(0);
    expect(sut.name).toBe(props.name);
  });

  it('getter of email field', () => {
    expect(sut.email).toBeDefined();
    expect(typeof sut.email).toBe('string');
    expect(sut.email.length).toBeGreaterThan(0);
    expect(sut.email).toBe(props.email);
  });

  it('getter of password field', () => {
    expect(sut.password).toBeDefined();
    expect(typeof sut.password).toBe('string');
    expect(sut.password.length).toBeGreaterThan(0);
    expect(sut.password).toBe(props.password);
  });

  it('getter of createdAt field', () => {
    expect(sut.createdAt).toBeDefined();
    expect(sut.createdAt).toBeInstanceOf(Date);
    expect(sut.createdAt).toBe(props.createdAt);
  });

  it('getter of updatedAt field', () => {
    expect(sut.updatedAt).toBeDefined();
    expect(sut.updatedAt).toBeInstanceOf(Date);
    expect(sut.updatedAt).toBe(props.updatedAt);
  });
});
