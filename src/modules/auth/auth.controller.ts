import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateUserResponse,
  LoginResponse,
  LogOutResponse,
  RefreshTokenResponse,
} from './dtos/auth.response.dto';
import { ResponseSerializer } from '../../interceptor/response.interceptor';
import { Response } from 'express';
import { CreateUserDTO } from './dtos/create-user-dto';
import { LoginUserDTO } from './dtos/auth.login.dto';
import { Auth, AuthStrategy } from './decorator/auth.decorator';
import { RefreshTokenDto } from './dtos/refreshToken.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('auth')
@Auth(AuthStrategy.None)
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiCreatedResponse({
    description: 'user created succesfully',
    type: CreateUserResponse,
  })
  @ApiBadRequestResponse({ description: 'email or username already taken' })
  @ApiBody({ type: CreateUserDTO })
  @Post('singup')
  register(@Body() body: CreateUserDTO): Promise<CreateUserResponse> {
    return this.authService.register(body);
  }

  @ApiOkResponse({ description: 'login succesfully', type: LoginResponse })
  @ApiNotFoundResponse({ description: 'account does not found!!' })
  @ApiBadRequestResponse({ description: 'identify or password incorenct!!' })
  @ApiBody({ type: LoginUserDTO })
  @ResponseSerializer(LoginResponse)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() body: LoginUserDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponse> {
    try {
      const { accessToken, refreshToken } = await this.authService.login(body);
      // store accessToken and refreshToken into cookie
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 + 1000),
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 + 1000),
      });

      return { accessToken, refreshToken };
    } catch (err) {
      throw err;
    }
  }

  @ApiBody({ type: RefreshTokenDto })
  @ApiForbiddenResponse({ description: 'Unknown Error' })
  @ApiOkResponse({
    description: 'user logout succesfully',
    type: LogOutResponse,
  })
  @ApiHeader({
    name: 'Autorization Bearer',
    description: 'authorize user with',
    required: true,
  })
  @ApiBearerAuth()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @Auth(AuthStrategy.Bearer)
  async logout(
    @Body() body: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LogOutResponse> {
    try {
      const result = await this.authService.logOut(body.refreshToken);
      if (!result.success) throw new ForbiddenException('unknown error. ');

      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return result;
    } catch (err) {
      throw err;
    }
  }

  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({
    description: 'generate new accessToken and refreshToken',
    type: RefreshTokenResponse,
  })
  @ApiUnauthorizedResponse({ description: 'refreshToken invalid or expired' })
  @Post('/token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Body() body: RefreshTokenDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<RefreshTokenResponse> {
    try {
      const { accessToken, refreshToken } = await this.authService.refreshToken(
        body.refreshToken,
      );
      response.cookie('accessToken', accessToken);
      response.cookie('refreshToken', refreshToken);
      return { accessToken, refreshToken };
    } catch (err) {
      throw err;
    }
  }
}
