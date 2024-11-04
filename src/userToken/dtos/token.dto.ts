import { IsNotEmpty, IsNumber, IsString } from "class-validator";



export class AccessTokenPyload {
   role:string;
    id:number;
   username:string 
}

export class RefreshTokenPayload {
    id:number;
}

export class RefreshTokenBodyDTO{
    @IsNotEmpty()
    refreshToken:string;
}