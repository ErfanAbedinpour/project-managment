import { BadRequestException, Body,  Controller,  Delete,  Get, Inject,  Patch, Post, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import {Response} from 'express';
import { CurentUser } from "./user.decorator";
import { AccessTokenPyload, UserTokenParam } from "../userToken/dtos/token.dto";
import { UserServices } from "./user.service";
import { UserResponseDTO, UserUpdatedBodyDTO } from "./dtos/user.dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { IsAuth } from "../auth/auth.guard";
import { ResponseSerializer } from "../interceptor/response.interceptor";
import { UserTokenService } from "../userToken/userToken.service";
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { UserTokens } from "../userToken/userTokens.decorator";

@Controller('/user')
@UseGuards(IsAuth)
export class UserController{
    constructor( 
      private readonly userService:UserServices,
      private readonly userToken:UserTokenService,
      @Inject(CACHE_MANAGER) private readonly cache:Cache,
    ){
    }

    @Get("me")
    me(@CurentUser() me:AccessTokenPyload){
        return me;
    }

    // update user
    @Patch()
    @ResponseSerializer(UserResponseDTO)
    async updateUser(
      @CurentUser() user:AccessTokenPyload,
      @Body() body:UserUpdatedBodyDTO,
      @Res({passthrough:true}) res:Response,
      @UserTokens() userToken:UserTokenParam){
      try{
        const newUser = await this.userService.updateUser({id:user.id,data:body});

        await this.userToken.deleteToken({token:userToken.refreshToken});
        // set accessToken into blackList
        await this.cache.set(btoa(userToken.accessToken),userToken.accessToken);

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return newUser;
      }catch(err){
        if(err instanceof PrismaClientKnownRequestError){
          const {code,meta}= err;
          switch(code){
            case 'P2002':
              throw new BadRequestException(`${meta.target} is already taken.`);
            case 'P2025':
              throw new UnauthorizedException("please login again");
            default:
              console.error(err)
              throw new BadRequestException(`${err.code} is`);
          }
        }
        throw err;
      }
    }

    @Delete()
    deleteUser(@CurentUser() me:AccessTokenPyload,@UserTokens() tokens:UserTokenParam){
      /** 
       * TODO: validate User
       * TODO: send verified  code for user email
       * TODO: if confirm code remove User
      */
     return this.userService.deleteAccount(me.id); 
    }

    @Post("verify")
    verifyCode(){}

}