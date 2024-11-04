import {  Injectable} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { IEnvironmentVariables } from "../type";
import { UtilService } from "../util/util.service";
import { Prisma,  UserToken } from "@prisma/client";
import { JwtCustomeService } from "./jwt.service";



@Injectable()
export class UserTokenService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt:JwtCustomeService,
        private readonly env: ConfigService<IEnvironmentVariables>,
        private readonly util: UtilService
    ) { }


    async getUserByToken(token:string,
  ): Promise<UserToken| null> {
    return this.prisma.userToken.findFirst({
      where: {token},
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

  create(token: Prisma.UserTokenCreateInput):Promise<UserToken> {
    return this.prisma.userToken.create({ data: token});
  }


  async updateToken(params: {
    where: Prisma.UserTokenWhereUniqueInput;
    data: Prisma.UserTokenUpdateInput;
  }): Promise<UserToken> {
    const { where, data } = params;
    return this.prisma.userToken.update({
      data,
      where,
    });
  }

  async deleteToken(where: Prisma.UserTokenWhereUniqueInput): Promise<UserToken> {
    return this.prisma.userToken.delete({
      where,
    });
  }

}