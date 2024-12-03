import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
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

@Injectable()
export class UserServices {
  private readonly USER_NOT_FOUND = 'user does not found.';

  private readonly INVLID_CODE = 'code invalid.';

  private readonly logger = new Logger(UserServices.name);

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

  async updateUser(params: {
    id: number;
    data: Prisma.UserUpdateInput;
  }): Promise<Omit<UserDTO, 'password'>> {
    const { id, data } = params;
    const user = await this.findUserById(id);
    if (!user) throw new NotFoundException(this.USER_NOT_FOUND);

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
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  private async deleteAccount(userId: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }

  async sendVerificationCode(
    userId: number,
  ): Promise<{ success: boolean; mailInfo: SentMessageInfo }> {
    try {
      const user = await this.findUserById(userId);
      if (!user) throw new BadRequestException(this.USER_NOT_FOUND);

      let code = this.util.generateUniqueCode(10000, 99999);
      // set user verify code into cache
      await this.cache.set(`user-${user.id}`, code);

      const info = await this.mailer.sendMail({
        to: user.email,
        from: 'Mini Github',
        subject: 'Delete account Verification Code',
        text: `Your verification code is ${code} code will remove after 30 minutes`,
      });

      return { success: true, mailInfo: info };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async verifyCode(
    userId: number,
    code: number,
  ): Promise<{ success: boolean; user: Omit<UserDTO, 'password'> }> {
    const userCode = await this.cache.get(`user-${userId}`);
    if (!userCode || userCode !== code)
      throw new BadRequestException(this.INVLID_CODE);

    try {
      const user = await this.deleteAccount(userId);
      //remove code from cache
      await this.cache.del(`user-${userId}`);
      return { success: true, user: user };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  async deleteUser(userId: number) {
    const user = await this.findUserById(userId);

    if (!user) throw new NotFoundException(this.USER_NOT_FOUND);

    try {
      return await this.deleteAccount(user.id);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async getUserByUsername(username: string) {
    const user = await this.prisma.user.findFirst({ where: { username } });
    if (!user) throw new NotFoundException(this.USER_NOT_FOUND);
    return user;
  }
}
