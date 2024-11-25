import { Global, Module } from '@nestjs/common';
import { UserTokenService } from './userToken.service';
import { UtilModule } from '../util/util.module';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenService } from './jwt/accessToken.service';
import { RefreshTokenService } from './jwt/refreshToken.service';
import { ConfigModule } from '@nestjs/config';
import accessJwtConfig from './config/access.jwt.config';
import refreshJwtConfig from './config/refresh.jwt.config';

@Global()
@Module({
  imports: [
    PrismaModule,
    UtilModule,
    JwtModule.register({}),
    ConfigModule.forRoot({
      load: [refreshJwtConfig, accessJwtConfig],
    }),
  ],

  exports: [UserTokenService, AccessTokenService, RefreshTokenService],

  providers: [UserTokenService, AccessTokenService, RefreshTokenService],
})
export class UserTokenModule {}
