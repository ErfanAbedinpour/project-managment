import { registerAs } from "@nestjs/config";

export default registerAs('refreshToken', () => ({
    secret: process.env.REFRESH_TOKEN_SECRET,
    expireIn: `${process.env.REFRESH_TOKEN_EXPIRE}d`
}))