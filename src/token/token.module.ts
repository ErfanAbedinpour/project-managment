import {  Module } from "@nestjs/common";
import { TokenService } from "./token.service";
import { UtilModule } from "../util/util.module";
import { JwtModule,} from "@nestjs/jwt";
import { TokneController } from "./token.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { JwtCustomeService } from "./jwt.service";



@Module({
    imports:[
        PrismaModule,
        UtilModule,
        JwtModule.register({})
    ],

    exports:[
        TokenService,
        JwtCustomeService
    ],

    providers:[
        TokenService,
        JwtCustomeService 
    ],
    controllers:[TokneController]
})
export class TokenModule{}