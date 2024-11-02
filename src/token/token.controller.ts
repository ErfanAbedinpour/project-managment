import { Body, Controller, Post } from "@nestjs/common";
import { TokenService } from "./token.service";
import { RefreshTokenBodyDTO } from "./dtos/token.dto";


@Controller()
export class TokneController{
    constructor(private readonly tokenService:TokenService){}

    @Post()
    refresh(@Body() body:RefreshTokenBodyDTO){
        return this.tokenService.refresh(body.refreshToken)
    }
}