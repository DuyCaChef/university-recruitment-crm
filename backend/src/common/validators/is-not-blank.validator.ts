//====================================================
// Validator kiểm tra chuỗi không chỉ chứa khoảng trắng (blank string) trong NestJS
//====================================================
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isNotBlank', async: false })
class IsNotBlankConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return typeof value === 'string' && value.trim().length > 0;
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} không được chỉ chứa khoảng trắng`;
  }
}

export function IsNotBlank(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    registerDecorator({
      name: 'isNotBlank',
      target: target.constructor,
      propertyName: propertyKey.toString(),
      options: validationOptions,
      validator: IsNotBlankConstraint,
    });
  };
}
