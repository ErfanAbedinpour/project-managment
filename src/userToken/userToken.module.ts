import { Module } from "@nestjs/common";
import { UserTokenService } from "./userToken.service";
import { UtilModule } from "../util/util.module";
import { PrismaModule } from "../prisma/prisma.module";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { CacheModule } from "@nestjs/cache-manager";
import { AccessTokenService } from "./jwt/refreshToken.service";
import { RefreshTokenService } from "./jwt/accessToken.service";


@Module({
    imports: [
        PrismaModule,
        UtilModule,
        JwtModule.register({}),
    ],

    exports: [
        UserTokenService,
    ],

    providers: [
        UserTokenService,
        AccessTokenService,
        RefreshTokenService
    ],
})
export class UserTokenModule { }