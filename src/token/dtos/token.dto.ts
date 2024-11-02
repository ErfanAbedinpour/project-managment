import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AccessTokenPyload{
  @IsNotEmpty()
  @IsNumber()
  id:number
  @IsNotEmpty()
  @IsString()
  username:string;
  @IsNotEmpty()
  @IsString()
  role:string;
}

export class RefreshTokenPayload{
  user:number;
}


export class RefreshTokenBodyDTO{
    @IsNotEmpty()
    refreshToken:string;
}