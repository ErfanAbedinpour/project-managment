import { createParamDecorator, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Request } from "express";

export const CurentUser = createParamDecorator(
    (_:unknown,ctx:ExecutionContext)=>{
        const req= ctx.switchToHttp().getRequest<Request>();
        if(!req.user) throw new ForbiddenException();
        return req.user; 
    }
)