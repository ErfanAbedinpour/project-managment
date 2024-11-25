import { Test } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { UserTokenService } from '../../../src/userToken/userToken.service';
import { RefreshTokenService } from '../../../src/userToken/jwt/refreshToken.service';
import { HashingService } from '../hash/hash.service';
import { PrismaClient, User } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { BcryptHashing } from '../hash/bcrypt.service';
import { LoginUserDTO } from '../dtos/auth.login.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('Auth Service ', () => {
  let authService: AuthService;
  let prisma: DeepMockProxy<PrismaClient>;
  let userToken: DeepMockProxy<UserTokenService>;
  let refreshToken: DeepMockProxy<RefreshTokenService>;
  let hash: DeepMockProxy<BcryptHashing>;
  const user = {
    id: 1,
    email: 'test@gmail.com',
    display_name: 'erfan',
    password: '12341234',
    username: 'test usernam',
  } as User;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockDeep<PrismaClient>(),
        },
        {
          provide: UserTokenService,
          useValue: mockDeep<UserTokenService>(),
        },
        {
          provide: RefreshTokenService,
          useValue: mockDeep<RefreshTokenService>(),
        },
        {
          provide: HashingService,
          useValue: mockDeep<BcryptHashing>(),
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prisma = module.get(PrismaService);
    hash = module.get(HashingService);
    userToken = module.get(UserTokenService);
    refreshToken = module.get(RefreshTokenService);
  });

  it('init', () => {
    expect(authService).toBeDefined();
    expect(prisma).toBeDefined();
    expect(hash).toBeDefined();
    expect(userToken).toBeDefined();
    expect(refreshToken).toBeDefined();
  });

  describe('register', () => {
    it('Should be throw BadRequest because email is taken', async () => {
      prisma.user.findFirst.mockResolvedValue(user);

      await expect(
        authService.register({
          email: user.email,
          display_name: user.display_name,
          password: user.password,
          username: user.username,
        }),
      ).rejects.toThrow('email already taken.');
      expect(prisma.user.findFirst).toBeDefined();
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { email: user.email },
      });
    });

    it('Should be thorw Bad request for username is invalid', async () => {
      prisma.user.findFirst
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(user);

      await expect(
        authService.register({
          username: user.username,
          email: user.email,
          password: user.password,
          display_name: user.display_name,
        }),
      ).rejects.toThrow('username already taken.');

      expect(prisma.user.findFirst).toHaveBeenCalledTimes(2);
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { email: user.email },
      });
      expect(prisma.user.findFirst).toHaveBeenLastCalledWith({
        where: { username: user.username },
      });
    });

    it('Should be user created succesfully', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      prisma.user.create.mockResolvedValueOnce(user);
      hash.hash.mockImplementationOnce((password: string) =>
        Promise.resolve(`$${password}`),
      );

      await expect(
        authService.register({
          password: user.password,
          email: user.email,
          username: user.username,
          display_name: user.display_name,
        }),
      ).resolves.toEqual({ success: true });

      expect(hash.hash).toHaveBeenCalledWith(user.password);
      expect(prisma.user.findFirst).toHaveBeenCalledTimes(2);
    });
  });

  describe('login', () => {
    const loginUser = {
      identify: 'test1',
      password: '1234',
    } as LoginUserDTO;

    it('Should be throw NotFound for user does not exsist', async () => {
      prisma.user.findFirst.mockResolvedValueOnce(null);

      await expect(authService.login(loginUser)).rejects.toThrow(
        'user does not found',
      );
    });

    it('Should be throw BadRequest for wrong password', async () => {
      prisma.user.findFirst.mockResolvedValueOnce(user);
      hash.compare.mockResolvedValueOnce(false);

      await expect(authService.login(loginUser)).rejects.toThrow(
        'identify or password are incorrect',
      );

      expect(hash.compare).toHaveBeenCalledWith(
        loginUser.password,
        user.password,
      );
      expect(prisma.user.findFirst).toHaveBeenCalled();
    });

    it('Should be return accessToken and refreshToken', async () => {
      prisma.user.findFirst.mockResolvedValueOnce(user);
      hash.compare.mockResolvedValueOnce(true);
      const tokens = {
        accessToken: String(Math.random() * 1000),
        refreshToken: String(Math.random() * 1000),
      };
      userToken.getKeys.mockResolvedValueOnce(tokens);

      await expect(authService.login(loginUser)).resolves.toEqual(tokens);
      expect(hash.compare).toHaveBeenCalledWith(
        loginUser.password,
        user.password,
      );
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [{ email: loginUser.identify }, { username: loginUser.identify }],
        },
      });
      expect(userToken.getKeys).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should be return succesfully', async () => {
      userToken.invalidate.mockResolvedValueOnce();
      await expect(authService.logOut('')).resolves.toEqual({ success: true });
    });
  });

  describe('RefreshToken', () => {
    it('should be throw Unauth for user does not found', async () => {
      refreshToken.verify.mockResolvedValueOnce({ id: 10 });
      prisma.user.findFirst.mockResolvedValueOnce(null);
      const token = 'this is fake token';
      await expect(authService.refreshToken(token)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(refreshToken.verify).toHaveBeenCalledWith(token);
      expect(refreshToken.verify).toHaveReturned();
      expect(prisma.user.findFirst).toHaveReturned();
    });
    it('should be throw if token invalid', async () => {
      refreshToken.verify.mockResolvedValueOnce({ id: 1 });
      prisma.user.findFirst.mockResolvedValueOnce(user);
      userToken.isValid.mockResolvedValueOnce(false);

      const token = 'this is new token';
      await expect(authService.refreshToken(token)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(userToken.isValid).toHaveBeenCalledWith({
        userId: user.id,
        token,
      });
      expect(userToken.isValid).not.toHaveBeenCalledWith({
        userId: 3,
        token: 'asdf',
      });
    });

    it('Should be generate new tokens', async () => {
      refreshToken.verify.mockResolvedValueOnce({ id: user.id });
      prisma.user.findFirst.mockResolvedValueOnce(user);
      userToken.isValid.mockResolvedValueOnce(true);
      userToken.invalidate.mockResolvedValueOnce();
      const newTokens = {
        accessToken: 'new token',
        refreshToken: 'new refreshToken',
      };
      userToken.getKeys.mockResolvedValueOnce(newTokens);

      const token = 'old token';

      await expect(authService.refreshToken(token)).resolves.toEqual(newTokens);

      expect(userToken.getKeys).toHaveBeenCalledWith(user);

      expect(refreshToken.verify).toHaveBeenCalledWith(token);

      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { id: user.id },
      });

      expect(userToken.invalidate).toHaveBeenCalledWith(token);
    });
  });
});
