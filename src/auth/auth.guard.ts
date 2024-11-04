import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
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
    private readonly jwtService:JwtCustomeService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    const jwtToken = type === 'Bearer' ? token : null;

    if (!jwtToken)
      throw new UnauthorizedException(
        'header is empty. or is not valid please etner Bearrer ',
      );

    try {
      const payload:unknown= await this.jwtService.verifyAccessToken(jwtToken);
      const user = plainToInstance(AccessTokenPyload,payload)
      await validateOrReject(user)

      request.user = user;
      return true;
    } catch (err) {
      throw new ForbiddenException('token is invalid or expired. please get new. ');
    }
  }
}
