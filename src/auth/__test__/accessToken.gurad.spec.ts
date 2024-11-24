import { Test } from "@nestjs/testing";
import { AccessTokenGurad } from "../gurad/accessToken.gurad"
import { AccessTokenService } from "../../../src/userToken/jwt/accessToken.service";
import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { UserTokenModule } from "../../userToken/userToken.module";
import { CurentUser } from "../interface/curent-user.interface";

describe("AccessToken gurad ", () => {
  let gurad: AccessTokenGurad;
  let userToken: AccessTokenService;
  const VALID_USER_PAYLOAD: CurentUser = {
    email: "valida1@gmail.com",
    id: 1,
    role: "ADMIN",
    username: "validusername"
  }
  const VALID_USER_PAYLOAD2: CurentUser = {
    email: "valida2@gmail.com",
    id: 2,
    role: "ADMIN",
    username: "validusername2"
  }
  let VALID_TOKEN;
  let EXPIRED_TOKEN;
  const context = {
    switchToHttp: jest.fn()
  }


  beforeEach(async () => {
    const module = await Test.createTestingModule(
      {
        imports: [UserTokenModule],
        providers: [
          AccessTokenGurad,
        ]
      }
    ).compile()

    gurad = module.get(AccessTokenGurad)
    userToken = module.get(AccessTokenService);

    VALID_TOKEN = await userToken.sign(VALID_USER_PAYLOAD)
    EXPIRED_TOKEN = await userToken.sign(VALID_USER_PAYLOAD2, -100)
  })


  it("Init", () => {
    expect(gurad).toBeDefined();
  })


  it("Should be throw unAuthorized for header is not exsist", async () => {
    context.switchToHttp.mockReturnValueOnce({
      getRequest: () => ({
        headers: { authorization: VALID_TOKEN }
      })
    })

    const resPr = gurad.canActivate(context as unknown as ExecutionContext);

    expect(resPr).rejects.toThrow(UnauthorizedException)

    expect(resPr).rejects.toThrow("header should be Bearer.")
  })

  it('Should be thorw UnAuthroized for invalid token', () => {
    context.switchToHttp.mockReturnValueOnce({
      getRequest: () => ({
        headers: { authorization: "Bearer " + EXPIRED_TOKEN }
      })
    })

    const resPr = gurad.canActivate(context as unknown as ExecutionContext);
    expect(resPr).rejects.toThrow(UnauthorizedException)

    expect(resPr).rejects.toThrow("token is invalid or expired.")
  })

  it("ok path", async () => {
    context.switchToHttp.mockReturnValueOnce({
      getRequest: () => ({
        headers: { authorization: "Bearer " + VALID_TOKEN }
      })
    })


    const resPr = gurad.canActivate(context as unknown as ExecutionContext)
    await expect(resPr).resolves.toBe(true)
  })
})
