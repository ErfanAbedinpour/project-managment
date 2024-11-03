import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class IsAuth implements CanActivate {
  constructor(
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
      // const payload: AccessTokenPyload= await this.accessTokenJwt.verifyAsync(jwtToken);

      request.user = {};
      return true;
    } catch (err) {
      throw new ForbiddenException('token is expired. ');
    }
  }
}
