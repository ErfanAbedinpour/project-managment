import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { TokenService } from "./token.service";
import { RefreshTokenBodyDTO } from "./dtos/token.dto";
import { TokenGuard } from "./token.guard";


@UseGuards(TokenGuard)
@Controller()
export class TokneController{
    constructor(private readonly tokenService:TokenService){}

    @Post("/refresh")
    refresh(@Body() body:RefreshTokenBodyDTO){
        return this.tokenService.refresh(body.refreshToken)
    }
}