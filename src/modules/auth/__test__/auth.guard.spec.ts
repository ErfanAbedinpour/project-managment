import { Test } from '@nestjs/testing';
import { AuthGurad } from '../gurad/auth.guard';
import { Reflector } from '@nestjs/core';
import { UserTokenModule } from '../../userToken/userToken.module';
import { AccessTokenGurad } from '../gurad/accessToken.guard';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import {
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthStrategy } from '../decorator/auth.decorator';

describe('AccessToken gurad ', () => {
  let gurad: AuthGurad;
  const reflector = {
    getAllAndOverride: jest.fn(),
  };

  const context = {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: jest.fn(),
  };

  let accessTokenGurad: DeepMockProxy<AccessTokenGurad>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [UserTokenModule],
      providers: [
        AuthGurad,
        {
          provide: AccessTokenGurad,
          useValue: mockDeep<AccessTokenGurad>(),
        },
        {
          provide: Reflector,
          useValue: reflector,
        },
      ],
    }).compile();

    gurad = module.get(AuthGurad);
    accessTokenGurad = module.get(AccessTokenGurad);
  });

  it('Init', () => {
    expect(gurad).toBeDefined();
    expect(accessTokenGurad).toBeDefined();
  });

  it('Should be resolve true for AuthGurad is None and header is null', () => {
    context.switchToHttp.mockImplementationOnce(() => {
      return {
        getRequest: () => ({
          headers: { authorization: null },
        }),
      };
    });
    reflector.getAllAndOverride.mockImplementationOnce(
      (token: string, handlers: Function[]) => {
        return [AuthStrategy.None];
      },
    );

    const resPr = gurad.canActivate(context as unknown as ExecutionContext);
    expect(resPr).resolves.toBe(true);
    expect(context.getHandler).toHaveBeenCalled();
    expect(context.getClass).toHaveBeenCalledTimes(1);
    expect(context.getHandler).toHaveBeenCalledTimes(1);
    expect(accessTokenGurad.canActivate).not.toHaveBeenCalled();
  });

  it('thorw an Error if accessToken gurad throw Error', () => {
    context.switchToHttp.mockImplementationOnce(() => {
      return {
        getRequest: () => ({
          headers: { authorization: 'token' },
        }),
      };
    });
    accessTokenGurad.canActivate.mockRejectedValueOnce(
      new UnauthorizedException(''),
    );
    reflector.getAllAndOverride.mockImplementationOnce(
      (token: string, handlers: Function[]) => {
        return [AuthStrategy.Bearer];
      },
    );

    const resPr = gurad.canActivate(context as unknown as ExecutionContext);
    expect(resPr).rejects.toThrow(UnauthorizedException);
    expect(accessTokenGurad.canActivate).toHaveBeenCalled();
    expect(accessTokenGurad.canActivate).toHaveBeenCalledTimes(1);
  });

  it('shold be pass if authGurad return true', () => {
    context.switchToHttp.mockImplementationOnce(() => {
      return {
        getRequest: () => ({
          headers: { authorization: 'token' },
        }),
      };
    });

    accessTokenGurad.canActivate.mockResolvedValue(true);

    reflector.getAllAndOverride.mockImplementationOnce(
      (token: string, handlers: Function[]) => {
        return [AuthStrategy.Bearer];
      },
    );

    const resPr = gurad.canActivate(context as unknown as ExecutionContext);
    expect(resPr).resolves.toBe(true);
    expect(accessTokenGurad.canActivate).toHaveBeenCalled();
    expect(accessTokenGurad.canActivate).toHaveBeenCalledTimes(1);
  });

  it('Should be thorw Error if user set invalid header even route in open', () => {
    context.switchToHttp.mockImplementationOnce(() => {
      return {
        getRequest: () => ({
          headers: { authorization: 'token' },
        }),
      };
    });

    accessTokenGurad.canActivate.mockResolvedValue(false);

    reflector.getAllAndOverride.mockImplementationOnce(
      (token: string, handlers: Function[]) => {
        return [AuthStrategy.None];
      },
    );

    const resPr = gurad.canActivate(context as unknown as ExecutionContext);
    expect(resPr).resolves.toBe(true);
    expect(accessTokenGurad.canActivate).toHaveBeenCalled();
    expect(accessTokenGurad.canActivate).toHaveBeenCalledTimes(1);
    expect(accessTokenGurad.canActivate).toHaveBeenCalled();
  });

  it('Shoule be pass from accessGurad if user set header even route is open', () => {
    context.switchToHttp.mockImplementationOnce(() => {
      return {
        getRequest: () => ({
          headers: { authorization: 'asdfasdfasdf' },
        }),
      };
    });

    accessTokenGurad.canActivate.mockResolvedValue(true);

    reflector.getAllAndOverride.mockImplementationOnce(
      (token: string, handlers: Function[]) => {
        return [AuthStrategy.None];
      },
    );

    const resPr = gurad.canActivate(context as unknown as ExecutionContext);
    expect(resPr).resolves.toBe(true);
    expect(accessTokenGurad.canActivate).toHaveBeenCalled();
    expect(accessTokenGurad.canActivate).toHaveBeenCalledTimes(1);
  });

  it('route is public also and private when use set header should pass form accessGurad', () => {
    context.switchToHttp.mockImplementationOnce(() => {
      return {
        getRequest: () => ({
          headers: { authorization: 'asdfasdfasdf' },
        }),
      };
    });

    accessTokenGurad.canActivate.mockResolvedValue(true);

    reflector.getAllAndOverride.mockImplementationOnce(
      (token: string, handlers: Function[]) => {
        return [AuthStrategy.None, AuthStrategy.Bearer];
      },
    );

    const resPr = gurad.canActivate(context as unknown as ExecutionContext);
    expect(resPr).resolves.toBe(true);

    expect(accessTokenGurad.canActivate).toHaveBeenCalled();
    expect(accessTokenGurad.canActivate).toHaveBeenCalledTimes(1);
  });
  it('route is public also and private when user is not set header should pass directly', () => {
    context.switchToHttp.mockImplementationOnce(() => {
      return {
        getRequest: () => ({
          headers: { authorization: null },
        }),
      };
    });

    accessTokenGurad.canActivate.mockResolvedValue(true);

    reflector.getAllAndOverride.mockImplementationOnce(
      (token: string, handlers: Function[]) => {
        return [AuthStrategy.None, AuthStrategy.Bearer];
      },
    );

    const resPr = gurad.canActivate(context as unknown as ExecutionContext);
    expect(resPr).resolves.toBe(true);

    expect(accessTokenGurad.canActivate).not.toHaveBeenCalled();
    expect(accessTokenGurad.canActivate).toHaveBeenCalledTimes(0);
  });
});
