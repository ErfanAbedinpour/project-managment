import { CallHandler, ExecutionContext, ForbiddenException, Injectable, NestInterceptor, UnauthorizedException, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import { JwtCustomeService } from "../userToken/jwt.service";
import { AccessTokenPyload } from "../userToken/dtos/token.dto";

@Injectable()
export class Authorization implements NestInterceptor {
    constructor(private readonly jwt: JwtCustomeService) { }
    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
        //request scoop
        const req = context.switchToHttp().getRequest<Request>();
        const { accessToken } = req.cookies;
        console.log("this is my accessToken", accessToken)
        if (accessToken) {
            try {
                const payload: AccessTokenPyload = await this.jwt.verifyAccessToken(accessToken);
                console.log("pyalod ", payload)
                req.user = payload
            } catch (err) {
                console.error(err);
                throw new UnauthorizedException("token is invalid.")
            }
        }

        return next.handle()
    }
}