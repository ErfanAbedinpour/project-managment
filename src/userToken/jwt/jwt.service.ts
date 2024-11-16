import { AccessTokenPyload, RefreshTokenPayload } from "../dtos/token.dto";

export abstract class JwtServiceAbstract {
    abstract sign(payload: object): Promise<string>

    abstract verify(token: string): Promise<AccessTokenPyload>
}