import { Module } from "@nestjs/common";
import { UserTokenService } from "./userToken.service";
import { UtilModule } from "../util/util.module";
import { PrismaModule } from "../prisma/prisma.module";
import { JwtCustomeService } from "./jwt.service";
import { JwtModule } from "@nestjs/jwt";
import { CacheModule } from "@nestjs/cache-manager";



@Module({
    imports: [
        PrismaModule,
        UtilModule,
        JwtModule.register({}),
    ],

    exports: [
        UserTokenService,
        JwtCustomeService
    ],

    providers: [
        UserTokenService,
        JwtCustomeService
    ],
})
export class UserTokenModule { }