import { Test } from '@nestjs/testing';
import { JwtCustomeService } from '../jwt.service';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { UtilModule } from '../../util/util.module';
import { PrismaService } from '../../prisma/prisma.service';
import { UserToken } from '@prisma/client';
import { UserTokenService } from '../userToken.service';

describe('token service', () => {
  let tokenService: UserTokenService;
  let prismaMockService: Partial<PrismaService> = {};
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: join(process.cwd(), '.env.test'),
        }),
        UtilModule,
      ],

      providers: [
        UserTokenService,
        JwtCustomeService,
        {
          provide: PrismaService,
          useValue: prismaMockService,
        },
      ],
    }).compile();
    tokenService = module.get<UserTokenService>(UserTokenService);
  });

  it('should be defined', () => {
    expect(tokenService).toBeDefined();
  });
});
