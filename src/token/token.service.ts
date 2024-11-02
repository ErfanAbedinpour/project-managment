import { Inject, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "@prisma/client";
import { AccessTokenPyload, RefreshTokenPayload } from "./dtos/token.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { IEnvironmentVariables } from "../type";
import { UtilService } from "../util/util.service";



@Injectable()
export class TokenService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject("ACCESS_TOKEN_JWT") private readonly accessTokenJwt: JwtService,
        @Inject("REFRESH_TOKEN_JWT") private readonly refreshTokenJwt: JwtService,
        private readonly env: ConfigService<IEnvironmentVariables>,
        private readonly util: UtilService

    ) { }

    private async generateTokens(user: Pick<User, "id" | "role" | "username">): Promise<{ accessToken: string; refreshToken: string; }> {
        const accessTokenpayload: AccessTokenPyload = {
            id: user.id,
            role: user.role,
            username: user.username
        }
        try {
            const accessToken = await this.accessTokenJwt.signAsync(accessTokenpayload)

            const refreshTokenPayload: RefreshTokenPayload = {
                user: user.id
            }

            const refreshToken = await this.accessTokenJwt.signAsync(refreshTokenPayload)

            return { accessToken, refreshToken }

        } catch (err) {
            throw err;
        }
    }

    async createToken({ username, role, id }: User): Promise<{ accessToken: string; refreshToken: string }> {
        try {
            const { accessToken, refreshToken } = await this.generateTokens({ username, id, role });

            const expireTime = this.util.dayToMilisecond(+this.env.getOrThrow<string>('REFRESH_TOKEN_EXPIRE'))

            await this.prisma.userToken.create({
                data: {
                    token: refreshToken,
                    userId: id,
                    expireAt: new Date(expireTime),
                }
            })

            return { accessToken, refreshToken }
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }


    async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
        try {
            // validate token
            const token = await this.prisma.userToken.findFirst(
                {
                    where: { AND: [{ token: refreshToken }, { isRevoke: false }] },
                    include: {
                        user: {
                            select: {
                                username: true,
                                role: true,
                                id: true
                            }
                        }
                    }
                }
            );

            if (!token || token.expireAt.getTime() < Date.now())
                throw new UnauthorizedException("token is invaid!.");



            await this.refreshTokenJwt.verifyAsync(refreshToken, {
                secret: this.env.getOrThrow("JWT_SECRET")
            });


            const { accessToken, refreshToken: newRefreshToken } = await this.generateTokens(token.user)

            const expireTime = this.util.dayToMilisecond(+this.env.getOrThrow<string>("REFRESH_TOKEN_EXPIRE"));

            await this.prisma.userToken.update({
                where: {
                    token: refreshToken
                },
                data: {
                    token: newRefreshToken,
                    expireAt: new Date(expireTime)
                }
            })

            return {
                refreshToken: newRefreshToken,
                accessToken
            }

        } catch (err) {
            throw new UnauthorizedException("token is expired. please login again. ")
        }
    }
}