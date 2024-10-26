import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JsonWebTokenError, JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { TokenPaylaod } from "./dtos/auth.dto";

@Injectable()
export class IsAuth implements CanActivate {
    constructor(private readonly jwt: JwtService, private readonly env: ConfigService) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        const jwtToken = type === 'Bearer' ? token : null;

        if (!jwtToken) 
            throw new UnauthorizedException("header is empty. or is not Bearer");

        try {
            const payload:TokenPaylaod = await this.jwt.verifyAsync(jwtToken, {
                secret: this.env.getOrThrow('SECRET')
            });
            request.user = payload;
            return true;
        } catch (err) {
            throw new ForbiddenException('token is expired. ');
        }
    }
}


