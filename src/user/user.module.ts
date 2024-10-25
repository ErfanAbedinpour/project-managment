import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { UserServices } from "./user.service";
import { UserController } from "./user.controller";



@Module({
    imports:[PrismaModule],
    controllers:[UserController],
    providers:[UserServices]
})
export class UserModule{}