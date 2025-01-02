import { Inject, Injectable } from '@nestjs/common';
import { JwtServiceAbstract } from './jwt.service';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import accessJwtConfig from '../config/access.jwt.config';
import { CurentUser } from '../../auth/interface/curent-user.interface';

@Injectable()
export class AccessTokenService implements JwtServiceAbstract {
  constructor(
    private readonly jwt: JwtService,
    @Inject(accessJwtConfig.KEY)
    private readonly configuration: ConfigType<typeof accessJwtConfig>,
  ) {}

  sign(payload: CurentUser, expireIn?: number): Promise<string> {
    return this.jwt.signAsync(payload, {
      secret: this.configuration.secret,
      expiresIn: expireIn || this.configuration.expireIn,
    });
  }
  verify(token: string): Promise<CurentUser> {
    return this.jwt.verify(token, {
      secret: this.configuration.secret,
    });
  }
}
