import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PROJECT_STATUS } from '../../../type/enums';

@ValidatorConstraint({ name: 'AtOneLeastRequired', async: false })
class AtOneLeastRequired implements ValidatorConstraintInterface {
  validate(
    _: unknown,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    const myDto = validationArguments.object as UpdateProjectDTO;

    return !!(
      myDto.name ||
      myDto.description ||
      myDto.isPublic ||
      myDto.status
    );
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'At least one field must be filled';
  }
}

export class UpdateProjectDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(100)
  description: string;

  @IsEnum(PROJECT_STATUS)
  @IsOptional()
  status: PROJECT_STATUS;

  @IsBoolean()
  @IsOptional()
  isPublic: boolean;
  @Validate(AtOneLeastRequired)
  atLeastOneField?: string;
}
