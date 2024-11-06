import { IsEmail, IsOptional, IsString,  MaxLength, MinLength, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";




@ValidatorConstraint({name:"AtOneLeastRequired",async:false})
class AtOneLeastRequired implements ValidatorConstraintInterface{
    validate(_: unknown, validationArguments?: ValidationArguments): Promise<boolean> | boolean {

        const myDto = validationArguments.object as UserUpdatedBodyDTO;

        return !!(myDto.username || myDto.email|| myDto.display_name)
    }
    defaultMessage(validationArguments?: ValidationArguments): string {
        return "At least one field must be filled"
    }
}


export class UserUpdatedBodyDTO{
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    username:string

    @IsOptional()
    @IsString()
    @MinLength(5)
    @MaxLength(50)
    display_name:string

    @IsOptional()
    @IsEmail()
    email:string

    @Validate(AtOneLeastRequired)
    atLeastOneField?: string; 
}