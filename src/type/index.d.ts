declare global {
  namespace Express {
    interface Request {
      user?: TokenPaylaod;
    }
  }
}

export interface IEnvironmentVariables {
  JWT_SECRET: string;
  DB_URL: string;
  ADMIN_USERNAME: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
}

export {};
