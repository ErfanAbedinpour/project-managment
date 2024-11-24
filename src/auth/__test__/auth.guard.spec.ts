import { Test } from "@nestjs/testing";
import { AccessTokenGurad } from "../gurad/accessToken.guard"
import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { UserTokenModule } from "../../userToken/userToken.module";
import { CurentUser } from "../interface/curent-user.interface";
import { AuthGurad } from "../gurad/auth.guard";

describe("AccessToken gurad ", () => {
    let gurad: AuthGurad;
    const VALID_USER_PAYLOAD: CurentUser = {
        email: "valida1@gmail.com",
        id: 1,
        role: "ADMIN",
        username: "validusername"
    }

    const context = {
        switchToHttp: jest.fn()
    }


    beforeEach(async () => {
        const module = await Test.createTestingModule(
            {
                providers: [
                    AuthGurad,
                ]
            }
        ).compile()

        gurad = module.get(AuthGurad)
    })


    it("Init", () => {
        expect(gurad).toBeDefined();
    })



})






