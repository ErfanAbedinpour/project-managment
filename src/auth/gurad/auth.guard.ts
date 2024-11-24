import { CanActivate, ExecutionContext, ForbiddenException, HttpException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AUTH_META_KEY, AuthStrategy } from "../decorator/auth.decorator";
import { AccessTokenGurad } from "./accessToken.guard";
import { Request } from "express";

@Injectable()
export class AuthGurad implements CanActivate {

    constructor(private readonly reflector: Reflector, private AccessTokenGurad: AccessTokenGurad) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const meta = this.reflector.getAllAndOverride<AuthStrategy[]>(AUTH_META_KEY, [context.getHandler(), context.getClass()])
            ?? [AuthStrategy.Bearer]


        const isUserSetHeader = !!context.switchToHttp().getRequest<Request>().headers?.authorization || null;

        /*
            if user not set any header and route is public everything is ok 
            but if user set header. user must be authorized even if route is public
         */
        if (!isUserSetHeader && meta.includes(AuthStrategy.None))
            return true

        try {
            await this.AccessTokenGurad.canActivate(context)
        } catch (err) {
            if (err instanceof UnauthorizedException)
                throw err
            throw new InternalServerErrorException()
        }
        return true
    }
}