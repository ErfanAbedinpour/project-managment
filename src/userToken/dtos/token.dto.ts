import { IsNotEmpty, IsNumber, IsString } from "class-validator";



export class AccessTokenPyload {
   @IsNotEmpty()
   @IsString()
   role:string;
   @IsNumber()
   @IsNotEmpty()
   id:number;
   @IsString()
   @IsNotEmpty()
   username:string 
}

export class RefreshTokenPayload {
    id:number;
}

export class RefreshTokenBodyDTO{
    @IsNotEmpty()
    refreshToken:string;
}

export class UserTokenParam{
    accessToken:string;
    refreshToken:string;
}