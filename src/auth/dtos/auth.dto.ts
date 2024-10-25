import { IsEmail,  IsString, Max, Min } from "class-validator";

export class CreateUserDTO{
    //email 
    @IsEmail()
    @IsString()
    email:string;
    //password
    @Max(80)
    @Min(8)
    @IsString()
    password:string;
    //username
    @IsString()
    @Max(60)
    @Min(3)
    username:string;
}