import {  Body,  Controller, ForbiddenException, Post, Res, UseGuards,} from "@nestjs/common";
import { CreateUserDTO, LoginUserDTO, logOutDTO,} from "./dtos/auth.dto";
import { AuthService } from "./auth.service";
import { LoginResponseDTO } from "./dtos/auth.response.dto";
import { ResponseSerializer } from "../interceptor/response.interceptor";
import { Response } from "express";
import { TokenGuard } from "../userToken/token.guard";


@Controller('auth')
export class AuthController{
    constructor(private readonly authService:AuthService){}
    @Post("singup")
    register(@Body() body:CreateUserDTO){
        return this.authService.register(body)
        
    }
    @ResponseSerializer(LoginResponseDTO)
    @Post('login')
    async login(@Body() body:LoginUserDTO,@Res({passthrough:true}) res:Response){
       try{
            const {accessToken,refreshToken} = await this.authService.login(body);

            // store accessToken and refreshToken into cookie
            res.cookie('accessToken',accessToken,{
                httpOnly:true,
                expires:new Date(Date.now()+7*24*60*60+1000),
            })
            res.cookie('refreshToken',refreshToken,{
                httpOnly:true,
                expires:new Date(Date.now()+7*24*60*60+1000),
            })

            return {accessToken,refreshToken}
       }catch(err){
            throw err;
       }
    }

    @Post('logout')
    @UseGuards(TokenGuard)
    async logout(@Body() body:logOutDTO,@Res({passthrough:true}) res:Response){
        try{
            const result = await this.authService.logOut(body.refreshToken);
            if(!result.success)
                throw new ForbiddenException("unknown error. ");
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            return result
        }catch(err){
            throw err;
        }
    }
}