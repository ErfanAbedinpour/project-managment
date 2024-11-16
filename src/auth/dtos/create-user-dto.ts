import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreateUserDTO {
    //email
    @IsEmail()
    @IsNotEmpty()
    email: string;
    //password
    @MinLength(8)
    @MaxLength(80)
    @IsNotEmpty()
    password: string;
    //username
    @MaxLength(50)
    @MinLength(3)
    @IsNotEmpty()
    username: string;
    @MaxLength(80)
    @MinLength(3)
    @IsNotEmpty()
    display_name: string;
}