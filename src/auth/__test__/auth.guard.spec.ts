import { Test } from "@nestjs/testing";
import { AuthGurad } from "../gurad/auth.guard";
import { Reflector } from "@nestjs/core";
import { UserTokenModule } from "../../userToken/userToken.module";
import { AccessTokenGurad } from "../gurad/accessToken.guard";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { ExecutionContext, ForbiddenException, SetMetadata } from "@nestjs/common";
import { AuthStrategy } from "../decorator/auth.decorator";

describe("AccessToken gurad ", () => {
    let gurad: AuthGurad;
    const reflector = {
        getAllAndOverride: jest.fn()
    }

    const context = {
        getHandler: jest.fn(),
        getClass: jest.fn()
    }

    let accessTokenGurad: DeepMockProxy<AccessTokenGurad>;


    beforeEach(async () => {
        const module = await Test.createTestingModule(
            {
                imports: [UserTokenModule],
                providers: [
                    AuthGurad,
                    {
                        provide: AccessTokenGurad,
                        useValue: mockDeep<AccessTokenGurad>()
                    },
                    {
                        provide: Reflector,
                        useValue: reflector
                    }
                ]
            }
        ).compile()

        gurad = module.get(AuthGurad)
        accessTokenGurad = module.get(AccessTokenGurad)
    })


    it("Init", () => {
        expect(gurad).toBeDefined();
        expect(accessTokenGurad).toBeDefined()
    })

    it("Should be resolve true for AuthGurad is None", () => {
        reflector.getAllAndOverride.mockImplementationOnce((token: string, handlers: Function[]) => {
            return [AuthStrategy.None]
        })

        const resPr = gurad.canActivate(context as unknown as ExecutionContext)
        expect(resPr).resolves.toBe(true)
        expect(context.getHandler).toHaveBeenCalled()
        expect(context.getClass).toHaveBeenCalledTimes(1)
        expect(context.getHandler).toHaveBeenCalledTimes(1)
    })

    it("thorw an Error if accessTOken gurad throw false", () => {
        accessTokenGurad.canActivate.mockResolvedValue(false);
        reflector.getAllAndOverride.mockImplementationOnce((token: string, handlers: Function[]) => {
            return [AuthStrategy.Bearer]
        })

        const resPr = gurad.canActivate(context as unknown as ExecutionContext)
        expect(resPr).rejects.toThrow(ForbiddenException)
        expect(accessTokenGurad.canActivate).toHaveBeenCalled()
        expect(accessTokenGurad.canActivate).toHaveBeenCalledTimes(1)
    })
    it("shold be throw ok with Bearer", () => {
        accessTokenGurad.canActivate.mockResolvedValue(true);
        reflector.getAllAndOverride.mockImplementationOnce((token: string, handlers: Function[]) => {
            return [AuthStrategy.Bearer]
        })

        const resPr = gurad.canActivate(context as unknown as ExecutionContext)
        expect(resPr).resolves.toBe(true)
        expect(accessTokenGurad.canActivate).toHaveBeenCalled()
        expect(accessTokenGurad.canActivate).toHaveBeenCalledTimes(1)
    })

})






