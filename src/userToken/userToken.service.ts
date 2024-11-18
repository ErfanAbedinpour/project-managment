import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User, UserToken } from "@prisma/client";
import { AccessTokenService } from "./jwt/accessToken.service";
import { RefreshTokenService } from "./jwt/refreshToken.service";



@Injectable()
export class UserTokenService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly AccessTokenService: AccessTokenService,
    private readonly refreshTokenService: RefreshTokenService,
  ) { }

  async getKeys(user: User): Promise<{ accessToken: string, refreshToken: string }> {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.AccessTokenService.sign({ email: user.email, id: user.id, role: user.role, username: user.username }),
        this.refreshTokenService.sign({ id: user.id })
      ])
      return { accessToken, refreshToken }
    } catch (err) {
      console.error(err)
      throw new InternalServerErrorException()
    }
  }
  async create(params: { userId: number, token: string }): Promise<UserToken> {
    const { token, userId } = params;
    return this.prisma.userToken.upsert({
      where: { userId },

      update: { token: token },

      create: {
        token: token,
        userId,
      }
    })
  }

  async isValid(params: { userId: number, token: string }): Promise<boolean> {
    const { token, userId } = params;
    const { token: tokenStore } = await this.prisma.userToken.findFirst({ where: { userId: userId } })
    return token === tokenStore;
  }

  async invalidate(userId: number): Promise<void> {
    return this.deleteToken(userId);
  }

  private async deleteToken(userId: number): Promise<void> {
    await this.prisma.userToken.delete({ where: { userId } });
  }
}