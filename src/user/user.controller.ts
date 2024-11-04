import { Controller, Get, UseGuards } from "@nestjs/common";
import { IsAuth } from "../auth/auth.guard";
import { CurentUser } from "./user.decorator";
import { AccessTokenPyload } from "../userToken/dtos/token.dto";


@Controller('/user')
@UseGuards(IsAuth)
export class UserController{
    @Get("me")
    me(@CurentUser() me:AccessTokenPyload){
        return me;
    }
}