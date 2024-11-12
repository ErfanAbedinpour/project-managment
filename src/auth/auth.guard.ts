import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtCustomeService } from '../userToken/jwt.service';
import { AccessTokenPyload } from '../userToken/dtos/token.dto';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

@Injectable()
export class IsAuth implements CanActivate {
  constructor(
    private readonly jwtService: JwtCustomeService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const { accessToken, refreshToken } = request.cookies;

    if (!accessToken || !refreshToken)
      throw new UnauthorizedException('you cannot access to this router please login first. ');

    try {
      const payload: unknown = await this.jwtService.verifyAccessToken(accessToken);
      const user = plainToInstance(AccessTokenPyload, payload)
      await validateOrReject(user)

      request.user = user;
      return true;
    } catch (err) {
      if (err instanceof HttpException)
        throw err;
      throw new UnauthorizedException('token is invalid or expired. please get new. ');
    }
  }
}
