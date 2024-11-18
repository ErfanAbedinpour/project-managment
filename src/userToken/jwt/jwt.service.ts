import { CurentUser } from "../../auth/interface/curent-user.interface";
import { RefreshTokenPayload } from "../dtos/token.dto";

export abstract class JwtServiceAbstract {
    abstract sign(payload: object): Promise<string>

    abstract verify(token: string): Promise<object>
}