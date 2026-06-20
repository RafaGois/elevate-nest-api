import { ClassValidatorFields } from '../../class-validator-fields';
import { IsString, MaxLength, IsNotEmpty, IsNumber } from 'class-validator';

class StubRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  constructor(data: any) {
    Object.assign(this, data);
  }
}

class StubClassValidatorFields extends ClassValidatorFields<StubRules> {
  validate(data: any): boolean {
    return super.validate(new StubRules(data));
  }
}

describe('ClassValidatorFields integration tests', () => {
  it('Should validate with errors', () => {
    const sut = new StubClassValidatorFields();

    //isso assegura que as alteraceos nos atributos da classe sejam validos
    expect(sut.validate(null)).toBeFalsy();
    expect(sut.errors).toMatchObject({
      name: [
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ],
      price: [
        'price should not be empty',
        'price must be a number conforming to the specified constraints',
      ],
    });
  });

  it('Should validate without errors', () => {
    const sut = new StubClassValidatorFields();

    expect(
      sut.validate({
        name: 'a',
        price: 10,
      }),
    ).toBeTruthy();
    expect(sut.validatedData).toMatchObject({
      name: 'a',
      price: 10,
    });
  });
});
