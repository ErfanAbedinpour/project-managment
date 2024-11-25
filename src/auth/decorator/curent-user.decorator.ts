import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurentUser } from '../interface/curent-user.interface';
import { Request } from 'express';

export const GetUser = createParamDecorator(
  (filed: keyof CurentUser, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();

    return filed ? request.user?.[filed] : request.user;
  },
);
