import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserTokenService } from '../userToken/userToken.service';
import { HashingService } from './hash/hash.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDTO } from './dtos/create-user-dto';
import { LoginUserDTO } from './dtos/auth.login.dto';
import { RefreshTokenService } from '../userToken/jwt/refreshToken.service';
import { CreateUserResponse, LogOutResponse } from './dtos/auth.response.dto';

@Injectable()
export class AuthService {

  private readonly logger = new Logger(AuthService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly userTokenService: UserTokenService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly hashingService: HashingService,
  ) { }

  async register(user: CreateUserDTO): Promise<CreateUserResponse> {
    const isEmailTaken = await this.prisma.user.findFirst({
      where: { email: user.email },
    });
    if (isEmailTaken) throw new BadRequestException('email already taken.');

    const isValidUserNmae = await this.prisma.user.findFirst({
      where: { username: user.username },
    });
    if (isValidUserNmae)
      throw new BadRequestException('username already taken.');
    try {
      const hashPassword = await this.hashingService.hash(user.password);

      await this.prisma.user.create({
        data: {
          username: user.username,
          email: user.email,
          password: hashPassword,
          display_name: user.display_name,
        },
      });
      return { success: true };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async login({
    identify,
    password,
  }: LoginUserDTO): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ email: identify }, { username: identify }] },
    });

    if (!user) throw new NotFoundException('user does not found');
    try {
      if (!(await this.hashingService.compare(password, user.password)))
        throw new BadRequestException('identify or password are incorrect');

      const { accessToken, refreshToken } =
        await this.userTokenService.getKeys(user);

      return {
        accessToken,
        refreshToken,
      };
    } catch (err) {
      this.logger.error(err)
      throw err;
    }
  }

  async logOut(token: string): Promise<LogOutResponse> {
    try {
      await this.userTokenService.invalidate(token);
      return { success: true };
    } catch (err) {
      this.logger.error(err)
    }
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const { id } = await this.refreshTokenService.verify(refreshToken);
      const user = await this.prisma.user.findFirst({ where: { id } });
      if (!user) throw new Error();

      const isValid = await this.userTokenService.isValid({
        userId: user.id,
        token: refreshToken,
      });
      if (!isValid) throw new Error();

      await this.userTokenService.invalidate(refreshToken);
      const { accessToken, refreshToken: newRefreshToken } =
        await this.userTokenService.getKeys(user);
      return { accessToken, refreshToken: newRefreshToken };
    } catch (err) {
      this.logger.error(err)
      throw new UnauthorizedException();

    }
  }
}
