import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '@nestjs-modules/mailer';
import { UtilService } from '../util/util.service';
import { SentMessageInfo } from 'nodemailer';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UserServices {
  constructor(
      private readonly prisma: PrismaService,
      private readonly mailer:MailerService,
      private readonly util:UtilService,
      @Inject(CACHE_MANAGER) private readonly cache:Cache,
  ) { }

  async user(
    where: Prisma.UserWhereInput,
  ): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: where,
    });
  }

  createUser(user: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data: user });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async updateUser(params:{id:number, data: Prisma.UserUpdateInput}): Promise<Omit<User,'password'>> {
    const {id,data} = params;
    return this.prisma.user.update({
      where:{id:id},
      data:data,
    })
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }

  async deleteAccount(userId:number):Promise<{success:boolean,mailInfo:SentMessageInfo}>{
    try{
      const user =await this.user({id:userId});
      if(!user)
        throw new BadRequestException("user does not found");

      let code =this.util.generateUniqueCode(10000,99999);
      await this.cache.set(user.id.toString(),code);
      // TODO: check if key is duplicate value is replace with that or not?

      const info = await this.mailer.sendMail({
        to:user.email,
        from:"Mini Github",
        subject:"Delete account Verification Code",
        text:`Your verification code is ${code}`,
      })

      return {success:true,mailInfo:info}

    }catch(err){
      throw err;
    }
  }
 
  
  async verifyCode(code:number){}
}
