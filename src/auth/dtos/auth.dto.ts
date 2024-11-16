import { Exclude, Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';


export class UserDTO {
  //display name
  @Expose()
  @IsNotEmpty()
  display_name: string
  //email
  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  //username
  @Expose()
  @IsNotEmpty()
  @IsString()
  username: string;
  @Expose()
  @IsNotEmpty()
  @IsString()
  profile: string
  @Exclude()
  password: string
}

export class TokenDTO {
  @IsString()
  @IsNotEmpty()
  refreshToken: string
}
