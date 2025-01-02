import { CurentUser } from '../modules/auth/interface/curent-user.interface';
import { AccessTokenPyload } from '../modules/userToken/dtos/token.dto';

declare global {
  namespace Express {
    interface Request {
      user?: CurentUser;
    }
  }
}

export interface IEnvironmentVariables {
  JWT_SECRET: string;
  DB_URL: string;
  ADMIN_USERNAME: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  REFRESH_TOKEN_EXPIRE: string;
  ACCESS_TOKEN_EXPIRE: string;
  REFRESH_TOKEN_SECRET: string;
  ACCESS_TOKEN_SECRET: string;
  EMAIL_USERNAME: string;
  EMAIL_PASSWORD: string;
  EMAIL_HOST: string;
}

export { };
