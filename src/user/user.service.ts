import { BadRequestException, ForbiddenException, HttpException, Inject, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '@nestjs-modules/mailer';
import { UtilService } from '../util/util.service';
import { SentMessageInfo } from 'nodemailer';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UserTokenService } from '../userToken/userToken.service';
import { UserDTO } from '../auth/dtos/auth.dto';

@Injectable()
export class UserServices {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailer: MailerService,
    private readonly util: UtilService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly userToken: UserTokenService
  ) { }

  async findUserById(id: number): Promise<User> {
    return this.prisma.user.findFirst({ where: { id } });
  }

  async updateUser(params: { id: number, data: Prisma.UserUpdateInput }): Promise<Omit<UserDTO, 'password'>> {
    const { id, data } = params;
    try {
      const newUser = await this.prisma.user.update({
        where: {
          id: id
        },
        data: data,
        select: {
          id: true,
          email: true,
          username: true,
          display_name: true,
          profile: true
        }
      })
      //remove user Token
      await this.userToken.deleteToken({ userId: id });

      return newUser;
    } catch (err) {
      throw err;
    }
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }

  async deleteAccount(userId: number): Promise<{ success: boolean, mailInfo: SentMessageInfo }> {
    try {
      const user = await this.findUserById(userId);
      if (!user)
        throw new BadRequestException("user does not found");

      let code = this.util.generateUniqueCode(10000, 99999);
      // set user verify code into cache
      await this.cache.set(user.id.toString(), code);

      const info = await this.mailer.sendMail({
        to: user.email,
        from: "Mini Github",
        subject: "Delete account Verification Code",
        text: `Your verification code is ${code} code will remove from 30 minute`,
      })

      return { success: true, mailInfo: info }

    } catch (err) {
      console.error(err);
      throw err;
    }
  }


  async verifyCode(userId: number, code: number): Promise<{ success: boolean, user: Omit<UserDTO, 'password'> }> {
    try {
      const userCode = await this.cache.get(userId.toString());
      if (!userCode)
        throw new ForbiddenException("code in expired. please take another");

      if (userCode !== code)
        throw new ForbiddenException("code in wrong. ");


      const user = await this.prisma.user.delete({
        where: {
          id: userId,
        },
        select: {
          id: true,
          username: true,
          role: true,
          email: true,
          profile: true,
          display_name: true
        }
      })
      //remove code from cache
      await this.cache.del(userId.toString());
      return { success: true, user: user }
    } catch (err) {
      throw err
    }
  }
}
