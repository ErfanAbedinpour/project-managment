import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { IEnvironmentVariables } from "../type";
import { AccessTokenPyload, RefreshTokenPayload } from "./dtos/token.dto";
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";



@Injectable()
export class JwtCustomeService {
    private readonly accessTokenJwt: JwtService;
    private readonly refreshTokenJwt: JwtService;

    constructor(private readonly config: ConfigService<IEnvironmentVariables>, @Inject(CACHE_MANAGER) private readonly cache: Cache) {
        this.accessTokenJwt = new JwtService({
            secret: this.config.getOrThrow<string>("ACCESS_TOKEN_SECRET"),
            signOptions: { expiresIn: this.config.getOrThrow<string>("ACCESS_TOKEN_EXPIRE") + 'm' }
        })


        this.refreshTokenJwt = new JwtService({
            secret: this.config.getOrThrow<string>("REFRESH_TOKEN_SECRET"),
            signOptions: { expiresIn: this.config.getOrThrow<string>("REFRESH_TOKEN_EXPIRE") + 'd' }
        })
    }

    async signAccessToken(payload: AccessTokenPyload): Promise<string> {
        return this.accessTokenJwt.signAsync(payload);
    }

    async signRefreshToken(payload: RefreshTokenPayload): Promise<string> {
        return this.refreshTokenJwt.signAsync(payload);
    }

    async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
        return this.refreshTokenJwt.verifyAsync(token);
    }

    async verifyAccessToken(token: string): Promise<AccessTokenPyload> {
        if (!(await this.cache.get<string>(btoa(token))))
            throw new Error("token is in blackList");
        return this.accessTokenJwt.verifyAsync(token);
    }
}