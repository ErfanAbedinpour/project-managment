import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { UserServices } from './user.service';
import {
  UserResponseDTO,
  UserUpdatedBodyDTO,
  VerifyCodeDTO,
} from './dtos/user.dto';
import { ResponseSerializer } from '../../interceptor/response.interceptor';
import { GetUser } from '../auth/decorator/curent-user.decorator';
import { CurentUser } from '../auth/interface/curent-user.interface';
import { UserDTO } from '../auth/dtos/auth.dto';

@Controller('/user/me')
export class UserController {
  constructor(private readonly userService: UserServices) { }

  @Get()
  me(@GetUser('id') userId: number) {
    this.userService.getMe(userId)
  }

  // update user
  @Patch()
  @ResponseSerializer(UserResponseDTO)
  async updateMe(
    @GetUser() user: CurentUser,
    @Body() body: UserUpdatedBodyDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const newUser = await this.userService.updateUser({
        id: user.id,
        data: body,
      });
      return newUser;
    } catch (err) {
      throw err;
    }
  }

  @Delete()
  deleteMe(@GetUser() me: CurentUser) {
    return this.userService.sendVerificationCode(me.id);
  }

  @Delete('verify')
  async verifyCode(
    @Res({ passthrough: true }) res: Response,
    @Body() body: VerifyCodeDTO,
    @GetUser() me: CurentUser,
  ) {
    try {
      const result = await this.userService.verifyCode(me.id, body.code);
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return result;
    } catch (err) {
      throw err;
    }
  }
}
