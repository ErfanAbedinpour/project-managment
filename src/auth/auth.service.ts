import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { AccessTokenPyload, CreateUserDTO, LoginUserDTO, RefreshTokenPayload } from "./dtos/auth.dto";
import { JwtService } from '@nestjs/jwt'
import { UserServices } from "../user/user.service";
import { UtilService } from "../util/util.service";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "@prisma/client";


@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserServices,
        private readonly util: UtilService,
        private readonly jwt: JwtService,
        private readonly prisma: PrismaService
    ) { }

    async register(user: CreateUserDTO):Promise<{success:boolean}> {
        try {
            const isEmailTaken = await this.userService.user({ email: user.email });
            if (isEmailTaken)
                throw new BadRequestException('email already taken.');

            const isValidUserNmae = await this.userService.user({ username: user.username });
            if (isValidUserNmae)
                throw new BadRequestException("username already taken.");

            const hashPassword = await this.util.hash(user.password);

            await this.userService.createUser({
                username: user.username,
                email: user.email,
                password: hashPassword,
                display_name: user.display_name,
            })
            return {success:true}
        } catch (err) {
            throw err;
        }
    }

    async login({ identify, password }: LoginUserDTO):Promise<{user:User,accessToken:string;refreshToken:string}> {
        try {
            const user = await this.userService.user({ OR: [{ email: identify }, { username: identify }] });
            if (!user)
                throw new NotFoundException("user does not found")

            if (!(await this.util.verify(password, user.password)))
                throw new BadRequestException("identify or password are incorrect")

            //accessToken payload
            const accessTokenPayLoad: AccessTokenPyload = {
                username: user.username,
                email: user.email,
                role: user.role,
                id: user.id,
                display_name: user.display_name
            }

            //refreshToken payload
            const refreshTokenPayload: RefreshTokenPayload = {
                user: user.id,
                exp: this.util.dayToMilisecond(7),
                iat: Date.now()
            }
            const {accessToken,refreshToken} =await   this.generateAuthToken(accessTokenPayLoad,refreshTokenPayload);
            

            return {
                user,
                accessToken: accessToken,
                refreshToken: refreshToken
            }
        } catch (err) {
            throw err;
        }
    }


    private async generateAuthToken(accessTokenPayload: AccessTokenPyload, refreshTokenPayload: RefreshTokenPayload)
    :Promise<{accessToken:string;refreshToken:string }> {
        try {
            const accessToken = await this.jwt.signAsync(accessTokenPayload, {
                expiresIn: "1h"
            })
            const refreshToken = await this.jwt.signAsync(refreshTokenPayload, {
                expiresIn: "7day"
            })

            await this.prisma.userToken.create({
                data: {
                    token: refreshToken,
                    userId: refreshTokenPayload.user,
                    expireAt: new Date(refreshTokenPayload.exp),
                }
            })

            return {accessToken,refreshToken}
        }catch(err){
            throw err;
        }
    }

}