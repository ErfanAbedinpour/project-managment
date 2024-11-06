import { IsEmail, IsOptional, IsString, Max, MaxLength, MinLength } from "class-validator";

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
}