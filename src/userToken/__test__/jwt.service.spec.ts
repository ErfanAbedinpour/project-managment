import { Test } from '@nestjs/testing';
import { JwtCustomeService } from '../jwt.service';
import { JsonWebTokenError, JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { AccessTokenPyload, RefreshTokenPayload } from '../dtos/token.dto';

describe('jwt Test', () => {
  let service: JwtCustomeService;
  let accessToken: string;
  let refreshToken: string;
  let accessTokenPayload: AccessTokenPyload;
  let refreshTokenPayload: RefreshTokenPayload;
  beforeAll(async () => {
    const moudle = await Test.createTestingModule({
      imports: [
        JwtModule.register({}),
        ConfigModule.forRoot({
          envFilePath: join(process.cwd(), '.env.test'),
          isGlobal: true,
        }),
      ],
      providers: [JwtCustomeService],
    }).compile();

    service = moudle.get<JwtCustomeService>(JwtCustomeService);
  });

  it('service should be definded', () => {
    expect(service).toBeDefined();
  });

  it('Should be generate accessToken', async () => {
    accessTokenPayload = {
      id: 1,
      role: 'admin',
      username: 'mmd',
    };
    accessToken = await service.signAccessToken(accessTokenPayload);
    expect(accessToken).toBeDefined();
  });

  it('Should be generate accessToken', async () => {
    refreshTokenPayload = {
      id: 1,
    };
    refreshToken = await service.signRefreshToken(refreshTokenPayload);
    expect(refreshToken).toBeDefined();
  });

  it('should be successfully verify accessToken', async () => {
    const payload = await service.verifyAccessToken(accessToken);
    expect(payload).toBeDefined();
    expect(payload).toBeTruthy();
    expect(payload.id).toEqual(accessTokenPayload.id);
    expect(payload.role).toEqual(accessTokenPayload.role);
    expect(payload.username).toEqual(accessTokenPayload.username);
  });

  it('Should be succesfully verify refreshToken', async () => {
    const payload = await service.verifyRefreshToken(refreshToken);
    expect(payload).toBeDefined();
    expect(payload).toBeTruthy();
    expect(payload.id).toEqual(refreshTokenPayload.id);
  });

  it('shoud be throw error for invalid accessToken', async () => {
    const token = accessToken.substring(8);
    const result = service.verifyAccessToken(token);
    expect(result).rejects.toThrow(JsonWebTokenError);
    expect(result).rejects.toThrow('invalid token');
  });

  it('shoud be throw error for invalid accessToken', async () => {
    const token = refreshToken.substring(8);
    const result = service.verifyRefreshToken(token);
    expect(result).rejects.toThrow(JsonWebTokenError);
    expect(result).rejects.toThrow('invalid token');
  });
});
