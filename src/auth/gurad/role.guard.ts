import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from '../decorator/role.decorator';
import { Request } from 'express';
import { ROLE } from '../enums/role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }
  canActivate(context: ExecutionContext): boolean {
    const roleContext = this.reflector.getAllAndOverride<ROLE[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roleContext) return true;

    const request = context.switchToHttp().getRequest<Request>();
    return roleContext.some((role) => role === request.user.role);
  }
}
