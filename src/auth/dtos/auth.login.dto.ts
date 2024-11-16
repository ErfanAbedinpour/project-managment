import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';


export class LoginUserDTO {
    @IsString()
    @IsNotEmpty()
    identify: string; // email or username
    @IsString()
    @MinLength(8)
    @MaxLength(80)
    password: string;
}