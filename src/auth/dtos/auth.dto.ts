import { IsEmail,  IsString, MaxLength, MinLength} from "class-validator";

export class CreateUserDTO{
    //email 
    @IsEmail()
    @IsString()
    email:string;
    //password
    @IsString()
    @MinLength(8)
    @MaxLength(80)
    password:string;
    //username
    @IsString()
    @MaxLength(50)
    @MinLength(3)
    username:string;
    @MaxLength(80)
    @MinLength(3)
    @IsString()
    display_name:string
}