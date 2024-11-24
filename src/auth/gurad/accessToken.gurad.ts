import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { AccessTokenService } from "../../userToken/jwt/accessToken.service";

@Injectable()
export class AccessTokenGurad implements CanActivate {
    constructor(private readonly accessTokenService: AccessTokenService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.getTokenFromHeader(request);

        if (!token)
            throw new UnauthorizedException("header should be Bearer.")

        try {
            const payload = await this.accessTokenService.verify(token);
            request.user = payload
        } catch (err) {
            throw new UnauthorizedException("token is invalid or expired.")
        }
        return true
    }

    private getTokenFromHeader(request: Request): string | undefined {
        const [_, token] = request.headers.authorization?.split(' ') || [];
        return token
    }
}