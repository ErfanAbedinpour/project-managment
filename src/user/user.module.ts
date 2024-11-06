import { Module } from "@nestjs/common";
import { UserServices } from "./user.service";
import { UserController } from "./user.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { UserTokenModule } from "../userToken/userToken.module";



@Module({
    imports:[PrismaModule,UserTokenModule,UserTokenModule],
    exports:[UserServices],
    controllers:[UserController],
    providers:[UserServices]
})
export class UserModule{}