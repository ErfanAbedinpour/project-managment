import { Body, Controller, Inject, Post, Res, UseGuards, } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginResponseDTO } from "./dtos/auth.response.dto";
import { ResponseSerializer } from "../interceptor/response.interceptor";
import { Response } from "express";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { CreateUserDTO } from "./dtos/create-user-dto";
import { LoginUserDTO } from "./dtos/auth.login.dto";
import { Auth, AuthStrategy } from "./gurad/auth.decorator";
import { AuthGurad } from "./gurad/auth.gurad";


@Controller('auth')
@UseGuards(AuthGurad)
@Auth(AuthStrategy.None)
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        @Inject(CACHE_MANAGER) private readonly cache: Cache
    ) { }
    @Post("singup")
    register(@Body() body: CreateUserDTO) {
        return this.authService.register(body)
    }

    @ResponseSerializer(LoginResponseDTO)
    @Post('login')
    async login(@Body() body: LoginUserDTO, @Res({ passthrough: true }) res: Response) {
        try {
            console.log('manam')
            const { accessToken, refreshToken } = await this.authService.login(body);

            // store accessToken and refreshToken into cookie
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 + 1000),
            })
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 + 1000),
            })

            return { accessToken, refreshToken }
        } catch (err) {
            throw err;
        }
    }

    // @Post('logout')
    // @UseGuards(TokenGuard)
    // async logout(@Res({ passthrough: true }) res: Response) {
    //     try {
    //         const result = await this.authService.logOut(userTokens.refreshToken);
    //         if (!result.success)
    //             throw new ForbiddenException("unknown error. ");

    //         const { accessToken } = userTokens;
    //         if (accessToken)
    //             // set accessToken into BlackList
    //             await this.cache.set(btoa(accessToken), accessToken);

    //         res.clearCookie("accessToken");
    //         res.clearCookie("refreshToken");
    //         return result
    //     } catch (err) {
    //         throw err;
    //     }
    // }
}