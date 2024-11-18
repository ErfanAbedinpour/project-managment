import { Inject, Injectable } from "@nestjs/common";
import { RefreshTokenPayload } from "../dtos/token.dto";
import { JwtServiceAbstract } from "./jwt.service";
import { JwtService } from "@nestjs/jwt";
import refreshJwtConfig from "../config/refresh.jwt.config";
import { ConfigType } from "@nestjs/config";

@Injectable()
export class RefreshTokenService implements JwtServiceAbstract {
    constructor(
        private readonly jwt: JwtService,
        @Inject(refreshJwtConfig.KEY)
        private readonly configuration: ConfigType<typeof refreshJwtConfig>
    ) { }
    sign(payload: RefreshTokenPayload): Promise<string> {
        return this.jwt.signAsync(payload, {
            secret: this.configuration.secret,
            expiresIn: this.configuration.expireIn
        })
    }

    verify(token: string): Promise<RefreshTokenPayload> {
        return this.jwt.verifyAsync(token, {
            secret: this.configuration.secret,
        })
    }
}