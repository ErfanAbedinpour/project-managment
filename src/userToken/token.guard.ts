import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtCustomeService } from "./jwt.service";
import { JsonWebTokenError } from "@nestjs/jwt";


@Injectable()
export class TokenGuard implements CanActivate{
    constructor(private readonly jwt:JwtCustomeService){}
    async canActivate(context: ExecutionContext): Promise<boolean>  {
        const req = context.switchToHttp().getRequest();
        const {refreshToken}= req.body;
        try{
            const payload = await this.jwt.verifyRefreshToken(refreshToken);
            return !!payload
        }catch(err){
            if(err instanceof JsonWebTokenError)
                throw new UnauthorizedException("token is invalid. please login again.")
            console.error(err)
            throw err;
        }
    }
}