import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AUTH_META_KEY, AuthStrategy } from "./auth.decorator";
import { AccessTokenGurad } from "./accessToken.gurad";

@Injectable()
export class AuthGurad implements CanActivate {
    private readonly authTypeMap: Record<AuthStrategy, CanActivate> = {
        [AuthStrategy.Bearer]: this.AccessTokenGurad,
        [AuthStrategy.None]: { canActivate: () => true }
    }
    constructor(private readonly reflector: Reflector, private AccessTokenGurad: AccessTokenGurad) { }


    async canActivate(context: ExecutionContext): Promise<boolean> {

        const meta = this.reflector.getAllAndOverride<AuthStrategy[]>(AUTH_META_KEY, [context.getHandler(), context.getClass()])
            ?? [AuthStrategy.Bearer]

        const gurads = meta.map((type) => this.authTypeMap[type]);

        for (const instance of gurads) {
            try {
                const resolve = await instance.canActivate(context)
                if (resolve)
                    return true
            } catch (err) {
                throw err
            }
        }
        throw new Error();
    }
}