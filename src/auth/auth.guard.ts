import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtCustomeService } from '../userToken/jwt.service';
import { AccessTokenPyload } from '../userToken/dtos/token.dto';
import { plainToInstance } from 'class-transformer';
import {  validateOrReject } from 'class-validator';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class IsAuth implements CanActivate {
  constructor(
    private readonly jwtService:JwtCustomeService,
    @Inject(CACHE_MANAGER) private readonly cache:Cache
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const {accessToken,refreshToken} = request.cookies;

    if (!accessToken || !refreshToken)
      throw new UnauthorizedException('you cannot access to this router please login first. ');
    
    try {
      // check token is in balckList
      const isInBlackList = await this.cache.get<string>(btoa(accessToken)) ;
      if(isInBlackList)
        throw new Error();
      const payload:unknown = await this.jwtService.verifyAccessToken(accessToken);
      const user = plainToInstance(AccessTokenPyload,payload)
      await validateOrReject(user)

      request.user = user;
      return true;
    } catch (err) {
      if(err instanceof HttpException)
        throw err;
      throw new UnauthorizedException('token is invalid or expired. please get new. ');
    }
  }
}
