import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { TokenService } from "./token.service";
import { RefreshTokenBodyDTO } from "./dtos/token.dto";
import { IsAuth } from "../auth/auth.guard";


@Controller()
export class TokneController{
    constructor(private readonly tokenService:TokenService){}

    @Post("/refresh")
    // @UseGuards(IsAuth)
    refresh(@Body() body:RefreshTokenBodyDTO){
        return this.tokenService.refresh(body.refreshToken)
    }
}