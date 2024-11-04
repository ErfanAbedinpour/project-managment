import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtCustomeService } from "./jwt.service";


@Injectable()
export class TokenGuard implements CanActivate{
    constructor(private readonly jwt:JwtCustomeService){}
    async canActivate(context: ExecutionContext): Promise<boolean>  {
        const req = context.switchToHttp().getRequest();
        const {refreshToken}= req.body;
        try{
            const payload = await this.jwt.verifyAccessToken(refreshToken);
            console.log('Payload is ',payload)
            return !!payload
        }catch(err){
            console.error("gurad " ,err)
            throw new UnauthorizedException("token is invalid. please login again.")
        }
    }
}