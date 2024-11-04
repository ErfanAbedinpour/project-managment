import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtCustomeService } from "./jwt.service";
import { JsonWebTokenError } from "@nestjs/jwt";
import { UserTokenService } from "./userToken.service";


@Injectable()
export class TokenGuard implements CanActivate{
    constructor(private readonly jwt:JwtCustomeService, private readonly userTokenService:UserTokenService){}
    async canActivate(context: ExecutionContext): Promise<boolean>  {
        const req = context.switchToHttp().getRequest();
        const {refreshToken}= req.body;
        try{
            //verify token 
            await this.jwt.verifyRefreshToken(refreshToken);
            //is refreshToken store in DB
            const isTokenValid = await this.userTokenService.getUserByToken(refreshToken);
            console.log(isTokenValid)
            return !!isTokenValid
        }catch(err){
            if(err instanceof JsonWebTokenError)
                throw new UnauthorizedException("token is invalid. please login again.")
            console.error(err)
            throw err;
        }
    }
}