import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const CurentUser = createParamDecorator(
    (_: unknown, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest<Request>();
        return req.user;
    }
)