import { Inject, Injectable } from "@nestjs/common";
import { AccessTokenPyload } from "../dtos/token.dto";
import { JwtServiceAbstract } from "./jwt.service";
import refreshJwtConfig from "../config/refresh.jwt.config";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import accessJwtConfig from "../config/access.jwt.config";

@Injectable()
export class AccessTokenService implements JwtServiceAbstract {
    constructor(
        private readonly jwt: JwtService,
        @Inject(accessJwtConfig.KEY)
        private readonly configuration: ConfigType<typeof accessJwtConfig>
    ) { }

    sign(payload: AccessTokenPyload): Promise<string> {
        return this.jwt.signAsync(payload, {
            secret: this.configuration.secret,
            expiresIn: this.configuration.expireIn
        })

    }
    verify(token: string): Promise<AccessTokenPyload> {
        return this.jwt.verify(token, {
            secret: this.configuration.secret
        })
    }
}