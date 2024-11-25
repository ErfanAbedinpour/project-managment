import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '@nestjs-modules/mailer';
import { UtilService } from '../util/util.service';
import { SentMessageInfo } from 'nodemailer';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UserTokenService } from '../userToken/userToken.service';
import { UserDTO } from '../auth/dtos/auth.dto';
import { NotFoundError } from 'rxjs';

@Injectable()
export class UserServices {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailer: MailerService,
    private readonly util: UtilService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly userToken: UserTokenService,
  ) {}

  async findUserById(id: number): Promise<User> {
    return this.prisma.user.findFirst({ where: { id } });
  }

  async updateMe(params: {
    id: number;
    data: Prisma.UserUpdateInput;
  }): Promise<Omit<UserDTO, 'password'>> {
    const { id, data } = params;
    try {
      const newUser = await this.prisma.user.update({
        where: {
          id: id,
        },
        data: data,
        select: {
          UserToken: { select: { token: true } },
          id: true,
          email: true,
          username: true,
          display_name: true,
          profile: true,
        },
      });
      //remove user Tokens
      for (const record of newUser.UserToken) {
        await this.userToken.invalidate(record.token);
      }

      return newUser;
    } catch (err) {
      throw err;
    }
  }

  private async deleteUserById(userId: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }

  async deleteAccount(
    userId: number,
  ): Promise<{ success: boolean; mailInfo: SentMessageInfo }> {
    try {
      const user = await this.findUserById(userId);
      if (!user) throw new BadRequestException('user does not found');

      let code = this.util.generateUniqueCode(10000, 99999);
      // set user verify code into cache
      await this.cache.set(user.id.toString(), code);

      const info = await this.mailer.sendMail({
        to: user.email,
        from: 'Mini Github',
        subject: 'Delete account Verification Code',
        text: `Your verification code is ${code} code will remove from 30 minute`,
      });

      return { success: true, mailInfo: info };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async verifyCode(
    userId: number,
    code: number,
  ): Promise<{ success: boolean; user: Omit<UserDTO, 'password'> }> {
    try {
      const userCode = await this.cache.get(userId.toString());
      if (!userCode)
        throw new ForbiddenException('code in expired. please take another');

      if (userCode !== code) throw new ForbiddenException('code in wrong. ');

      const user = await this.deleteUserById(userId);
      //remove code from cache
      await this.cache.del(userId.toString());
      return { success: true, user: user };
    } catch (err) {
      throw err;
    }
  }

  async deleteUser(userId: number) {
    const isUserExsist = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    if (!isUserExsist) throw new NotFoundException('user does not exsist');
    try {
      return await this.deleteUserById(userId);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async getUserByUsername(username: string) {
    return this.prisma.user.findFirst({ where: { username } });
  }
}
