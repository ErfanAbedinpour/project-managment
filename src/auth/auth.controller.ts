import { Body, Controller, ForbiddenException, HttpCode, HttpStatus, Inject, Post, Res, UseGuards, } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginResponseDTO } from "./dtos/auth.response.dto";
import { ResponseSerializer } from "../interceptor/response.interceptor";
import { Response } from "express";
import { CreateUserDTO } from "./dtos/create-user-dto";
import { LoginUserDTO } from "./dtos/auth.login.dto";
import { Auth, AuthStrategy } from "./decorator/auth.decorator";
import { RefreshTokenDto } from "./dtos/refreshToken.dto";
import { GetUser } from "./decorator/curent-user.decorator";
import { CurentUser } from "./interface/curent-user.interface";


@Controller('auth')
@Auth(AuthStrategy.None)
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }
    @Post("singup")
    register(@Body() body: CreateUserDTO) {
        return this.authService.register(body)
    }

    @ResponseSerializer(LoginResponseDTO)
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() body: LoginUserDTO, @Res({ passthrough: true }) res: Response) {
        try {
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

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @Auth(AuthStrategy.Bearer)
    async logout(@Body() body: RefreshTokenDto, @Res({ passthrough: true }) res: Response) {
        try {
            const result = await this.authService.logOut(body.refreshToken);
            if (!result.success)
                throw new ForbiddenException("unknown error. ");

            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            return result
        } catch (err) {
            throw err;
        }
    }

    @Post("/token")
    @HttpCode(HttpStatus.OK)
    refreshToken(@Body() body: RefreshTokenDto) {
        return this.authService.refreshToken(body.refreshToken);
    }
}