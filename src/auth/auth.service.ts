import { BadRequestException, Injectable, NotFoundException, UnauthorizedException, } from "@nestjs/common";
import { UserTokenService } from "../userToken/userToken.service";
import { HashingService } from "./hash/hash.service";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDTO } from "./dtos/create-user-dto";
import { LoginUserDTO } from "./dtos/auth.login.dto";
import { AccessTokenService } from "../userToken/jwt/accessToken.service";
import { RefreshTokenService } from "../userToken/jwt/refreshToken.service";


@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly userTokenService: UserTokenService,
        private readonly accessTokenService: AccessTokenService,
        private readonly refreshTokenService: RefreshTokenService,
        private readonly hashingService: HashingService
    ) { }

    async register(user: CreateUserDTO): Promise<{ success: boolean }> {
        try {
            const isEmailTaken = await this.prisma.user.findFirst({ where: { email: user.email } });
            if (isEmailTaken)
                throw new BadRequestException('email already taken.');

            const isValidUserNmae = await this.prisma.user.findFirst({ where: { username: user.username } });
            if (isValidUserNmae)
                throw new BadRequestException("username already taken.");

            const hashPassword = await this.hashingService.hash(user.password);

            await this.prisma.user.create({
                data: {
                    username: user.username,
                    email: user.email,
                    password: hashPassword,
                    display_name: user.display_name,
                }
            })
            return { success: true }
        } catch (err) {
            throw err;
        }
    }

    async login({ identify, password }: LoginUserDTO): Promise<{ accessToken: string; refreshToken: string }> {
        try {
            const user = await this.prisma.user.findFirst({ where: { OR: [{ email: identify }, { username: identify }] } });

            if (!user)
                throw new NotFoundException("user does not found")


            if (!(await this.hashingService.compare(password, user.password)))
                throw new BadRequestException("identify or password are incorrect")

            // generate tokens
            const accessToken = await this.accessTokenService.sign({
                username: user.username,
                role: user.role,
                id: user.id
            })

            const refreshToken = await this.refreshTokenService.sign({
                id: user.id,
            })

            await this.userTokenService.create({ token: refreshToken, userId: user.id });

            return {
                accessToken,
                refreshToken
            }
        } catch (err) {
            throw err;
        }
    }


    async logOut(refreshToken: string): Promise<{ success: boolean }> {
        try {
            await this.userTokenService.deleteToken({ token: refreshToken });
            return { success: true }
        } catch (err) {
            console.error('error during logOut ', err)
        }
    }

}