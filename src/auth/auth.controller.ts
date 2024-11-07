import {  Body,  Controller, ForbiddenException, Inject, Post, Req, Res, UseGuards,} from "@nestjs/common";
import { CreateUserDTO, LoginUserDTO,  TokenDTO,} from "./dtos/auth.dto";
import { AuthService } from "./auth.service";
import { LoginResponseDTO } from "./dtos/auth.response.dto";
import { ResponseSerializer } from "../interceptor/response.interceptor";
import {  Response } from "express";
import { TokenGuard } from "../userToken/token.guard";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { UserTokens } from "../userToken/userTokens.decorator";
import { UserTokenParam } from "../userToken/dtos/token.dto";


@Controller('auth')
export class AuthController{
    constructor(
        private readonly authService:AuthService,
        @Inject(CACHE_MANAGER) private readonly cache:Cache
    ){}
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
    async logout(@Res({passthrough:true}) res:Response,@UserTokens() userTokens:UserTokenParam){
        try{
            const result = await this.authService.logOut(userTokens.refreshToken);
            if(!result.success)
                throw new ForbiddenException("unknown error. ");

            const {accessToken} = userTokens;
            if(accessToken)
                // set accessToken into BlackList
                await this.cache.set(btoa(accessToken),accessToken);

            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            return result
        }catch(err){
            throw err;
        }
    }

    @Post('token')
    @UseGuards(TokenGuard)
    async refreshToken(@Body() body:TokenDTO,@Res({passthrough:true}) res:Response){

        try{
        const {accessToken,refreshToken} = await this.authService.refreshToken(body.refreshToken)

        res.cookie('accessToken',accessToken,{
                httpOnly:true,
                expires:new Date(Date.now()+7*24*60*60+1000),
        })
        res.cookie('refreshToken',refreshToken,{
                httpOnly:true,
                expires:new Date(Date.now()+7*24*60*60+1000),
        })

        return {
            accessToken,
            refreshToken
        }
        }catch(err){
            throw err
        }
    }
}