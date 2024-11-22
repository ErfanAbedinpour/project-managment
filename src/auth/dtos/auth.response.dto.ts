import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class CreateUserResponse {
    @ApiProperty()
    success: boolean
}
export class LoginResponse {
    @ApiProperty()
    @Expose()
    accessToken: string
    @ApiProperty()
    @Expose()
    refreshToken: string;
}

export class LogOutResponse {
    @ApiProperty()
    success: boolean;
}

export class RefreshTokenResponse extends LoginResponse { }