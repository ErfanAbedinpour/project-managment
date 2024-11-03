import {  Expose, Type } from "class-transformer";

export class LoginResponseDTO{
    @Expose()
    accessToken:string
    @Expose()
    refreshToken:string;
}