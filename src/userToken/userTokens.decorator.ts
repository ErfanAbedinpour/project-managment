import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const UserTokens = createParamDecorator(
    (_:unknown,context:ExecutionContext)=>{
        const req = context.switchToHttp().getRequest<Request>();
        const accessToken = req.cookies['accessToken']
        const refreshToken= req.cookies['refreshToken']

        return {accessToken,refreshToken};
    }
)