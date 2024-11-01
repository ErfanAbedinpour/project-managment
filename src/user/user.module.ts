import { Module } from "@nestjs/common";
import { UserServices } from "./user.service";
import { UserController } from "./user.controller";
import { PrismaModule } from "../prisma/prisma.module";



@Module({
    imports:[PrismaModule],
    exports:[UserServices],
    controllers:[UserController],
    providers:[UserServices]
})
export class UserModule{}