import {  Injectable} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { IEnvironmentVariables } from "../type";
import { UtilService } from "../util/util.service";
import { Prisma,  User,  UserToken } from "@prisma/client";



@Injectable()
export class UserTokenService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly env: ConfigService<IEnvironmentVariables>,
        private readonly util: UtilService
    ) { }


    async getUserByToken(token:string,
  ): Promise<Prisma.UserTokenGetPayload<{include:{user:{select:{username:true,role:true,id:true}}}}>| null> {
    return this.prisma.userToken.findFirst({
      where: {token,isRevoke:false},
      include:{
        user:{
          select:{
            username:true,
            role:true,
            id:true
          }
        }
      }
    });
  }

  create(data: {token:string;userId:number}):Promise<UserToken> {
    const expireTime = this.util.dayToMilisecond(+this.env.getOrThrow("REFRESH_TOKEN_EXPIRE"))
    return this.prisma.userToken.create({ data: {
      token:data.token,
      userId:data.userId,
      expireAt:new Date(expireTime)
    }});
  }


  async updateToken(params: {
    where: Prisma.UserTokenWhereInput;
    data: Prisma.UserTokenUpdateInput;
  }): Promise<Prisma.BatchPayload> {
    const { where, data } = params;
    return this.prisma.userToken.updateMany({
      data,
      where,
    });
  }

  deleteToken(where: Prisma.UserTokenWhereInput): Promise<Prisma.BatchPayload> {
    return this.prisma.userToken.deleteMany({
      where,
    });
  }
}