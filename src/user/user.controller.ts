import { BadRequestException, Body, Controller, Delete, Get, Inject, Patch, Post, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { Response } from 'express';
import { UserTokenParam } from "../userToken/dtos/token.dto";
import { UserServices } from "./user.service";
import { UserResponseDTO, UserUpdatedBodyDTO, VerifyCodeDTO } from "./dtos/user.dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ResponseSerializer } from "../interceptor/response.interceptor";
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { GetUser } from "../auth/decorator/curent-user.decorator";
import { CurentUser } from "../auth/interface/curent-user.interface";

@Controller('/user')
export class UserController {
  constructor(
    private readonly userService: UserServices,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {
  }

  @Get("me")
  me(@GetUser() me: CurentUser) {
    return me;
  }

  // update user
  @Patch()
  @ResponseSerializer(UserResponseDTO)
  async updateUser(
    @GetUser() user: CurentUser,
    @Body() body: UserUpdatedBodyDTO,
    @Res({ passthrough: true }) res: Response,) {
    try {
      const newUser = await this.userService.updateUser({ id: user.id, data: body });
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return newUser;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        const { code, meta } = err;
        switch (code) {
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
  deleteUser(@GetUser() me: CurentUser) {
    return this.userService.deleteAccount(me.id);
  }

  @Delete("verify")
  async verifyCode(@Res({ passthrough: true }) res: Response, @Body() body: VerifyCodeDTO, @GetUser() me: CurentUser) {
    try {
      const result = await this.userService.verifyCode(me.id, body.code);
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return result;
    } catch (err) {
      throw err;
    }

  }

}