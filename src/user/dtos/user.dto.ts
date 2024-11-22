import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsNotEmpty, isNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { ROLE } from "../../auth/enums/role.enum";
import { CreateUserDTO } from "../../auth/dtos/create-user-dto";




@ValidatorConstraint({ name: "AtOneLeastRequired", async: false })
class AtOneLeastRequired implements ValidatorConstraintInterface {
    validate(_: unknown, validationArguments?: ValidationArguments): Promise<boolean> | boolean {

        const myDto = validationArguments.object as UserUpdatedBodyDTO;

        return !!(myDto.username || myDto.email || myDto.display_name)
    }
    defaultMessage(validationArguments?: ValidationArguments): string {
        return "At least one field must be filled"
    }
}


export class UserUpdatedBodyDTO {
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    username: string

    @IsOptional()
    @IsString()
    @MinLength(5)
    @MaxLength(50)
    display_name: string

    @IsOptional()
    @IsEmail()
    email: string

    @Validate(AtOneLeastRequired)
    atLeastOneField?: string;
}


export class UserResponseDTO {
    @Expose()
    display_name: string
    @Exclude()
    password: string
    @Expose()
    email: string
    @Expose()
    id: number;
    @Expose()
    role: string
    @Exclude()
    username: string
}

export class VerifyCodeDTO {
    @IsNotEmpty()
    @IsNumber()
    code: number
}
