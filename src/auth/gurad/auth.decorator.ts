import { SetMetadata } from "@nestjs/common";
export const AUTH_META_KEY = 'authKey'
export enum AuthStrategy {
    Bearer = "Bearer",
    None = "None"
}

export const Auth = (...roles: AuthStrategy[]) => SetMetadata(AUTH_META_KEY, roles)