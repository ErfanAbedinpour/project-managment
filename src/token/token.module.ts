import { Module } from "@nestjs/common";
import { TokenService } from "./token.service";
import { PrismaService } from "../prisma/prisma.service";
import { UtilModule } from "../util/util.module";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { IEnvironmentVariables } from "../type";

@Module({
    imports:[PrismaService,UtilModule,JwtModule.register({})],
    exports:[
        TokenService,
        {
            provide:"ACCESS_JWT_SERVICE",
            useFactory(config:ConfigService<IEnvironmentVariables>) { 
                return new JwtService({
                    secret:config.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
                    global:true,
                    signOptions:{
                        expiresIn:`${config.getOrThrow<string>("ACCESS_TOKEN_EXPIRE")} h`
                    }
                })
            },
            inject:[ConfigService]
        },
        {
            provide:"REFRESH_JWT_SERVICE",
            useFactory(config:ConfigService<IEnvironmentVariables>) { 
                return new JwtService({
                    secret:config.getOrThrow<string>("REFRESH_TOKEN_SECRET"),
                    global:true,
                    signOptions:{
                        expiresIn:`${config.getOrThrow<string>("REFRESH_TOKEN_EXPIRE")} h`
                    }
                })
            },
        }

    ],
    providers:[TokenService]
})
export class TokenModule{}