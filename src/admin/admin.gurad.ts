import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { Observable, throwError } from "rxjs";


export class IsAdmin implements CanActivate{
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<Request>(); 
        if(!req.user)
            throw new UnauthorizedException("please login first. ")

        return req.user.role==="ADMIN"
    }
}