//import { validate as validateUuid } from 'node:crypto';
import { Entity } from '../../entity';

type StubEntityProps = {
  prop1: string;
  prop2: number;
};

const validateUuid = (id: string) => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    id,
  );
};

class StubEntity extends Entity<StubEntityProps> {
  constructor(props: StubEntityProps, id?: string) {
    super(props, id);
  }
}

describe('Entity Unit Tests', () => {
  it('should set props and id', () => {
    const props = {
      prop1: 'prop1 value',
      prop2: 10,
    };
    const entity = new StubEntity(props);

    expect(entity.props).toEqual(props);
    expect(entity.id).toBeDefined();
    expect(entity.id).toBe(entity._id);
    expect(validateUuid(entity.id)).toBeTruthy();
  });

  it('should accept a valid uuid', () => {
    const props = {
      prop1: 'prop1 value',
      prop2: 10,
    };
    const id = 'f9a7e33f-ce05-44d5-87c6-e369f29bfb2c';
    const entity = new StubEntity(props, id);

    expect(entity.props).toEqual(props);
    expect(entity.id).toBe(id);
    expect(entity._id).toBe(id);
  });

  it('should convert a entity to a JSON', () => {
    const props = {
      prop1: 'prop1 value',
      prop2: 10,
    };
    const entity = new StubEntity(props);

    expect(entity.toJSON()).toEqual({
      id: entity.id,
      ...props,
    });
  });
});
