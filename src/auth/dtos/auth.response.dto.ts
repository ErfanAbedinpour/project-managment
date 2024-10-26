import {  Expose, Type } from "class-transformer";
import { UserDTO } from "./auth.dto";

export class LoginResponseDTO{
    @Expose()
    @Type(()=>UserDTO)
    user:UserDTO
    @Expose()
    accessToken:string
}