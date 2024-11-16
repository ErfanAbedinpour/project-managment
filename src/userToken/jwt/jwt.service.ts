import { AccessTokenPyload, RefreshTokenPayload } from "../dtos/token.dto";

export abstract class JwtServiceAbstract {
    abstract sign(payload: AccessTokenPyload): Promise<string>

    abstract verify(token: string): Promise<AccessTokenPyload>
}