import { IsEmail,  IsString, Max, Min } from "class-validator";

export class CreateUserDTO{
    //email 
    @IsEmail()
    @IsString()
    email:string;
    //password
    @IsString()
    password:string;
    //username
    @IsString()
    username:string;
}