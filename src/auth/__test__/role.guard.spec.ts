import { Test } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { RoleGuard } from '../gurad/role.guard';
import { ROLE } from '../enums/role.enum';
import { CurentUser } from '../interface/curent-user.interface';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';

describe('AccessToken gurad ', () => {
  let gurad: RoleGuard;

  const FAKE_USER: CurentUser = {
    id: 1,
    role: 'ADMIN',
    email: 'validmail@gmail.com',
    username: 'validusername',
  };

  const reflector = {
    getAllAndOverride: jest.fn(),
  };

  const context = {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RoleGuard,
        {
          provide: Reflector,
          useValue: reflector,
        },
      ],
    }).compile();

    gurad = module.get(RoleGuard);
  });

  it('Init', () => {
    expect(gurad).toBeDefined();
  });

  it('Sould be pass', () => {
    context.switchToHttp.mockReturnValueOnce({
      getRequest: () => ({
        user: FAKE_USER,
      }),
    });

    reflector.getAllAndOverride.mockImplementation(
      (token: string, handlers: Function[]) => {
        return [ROLE.ADMIN];
      },
    );

    const resPr = gurad.canActivate(context as unknown as ExecutionContext);
    expect(resPr).toBe(true);
  });

  it('Should be pass if no role set', () => {
    reflector.getAllAndOverride.mockImplementation(
      (token: string, handlers: Function[]) => {
        return null;
      },
    );

    const resPr = gurad.canActivate(context as unknown as ExecutionContext);
    expect(resPr).toBe(true);
  });

  it('Should be fail if role not valid', () => {
    context.switchToHttp.mockReturnValueOnce({
      getRequest: () => ({
        user: FAKE_USER,
      }),
    });

    reflector.getAllAndOverride.mockImplementation(
      (token: string, handlers: Function[]) => {
        return [ROLE.SUPER_USER];
      },
    );

    const resPr = gurad.canActivate(context as unknown as ExecutionContext);
    expect(resPr).toBe(false);
  });
});
