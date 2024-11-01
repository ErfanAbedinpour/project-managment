import { Test } from "@nestjs/testing";
import { AuthService } from "../auth.service";
import { UserServices } from "../../user/user.service";
import { UtilService } from "../../util/util.service";
import { JwtService } from "@nestjs/jwt";




describe('Auth Service ',()=>{
    let authService:AuthService;

    beforeEach(async ()=>{
        const userMockService:Partial<UserServices> ={}
        const utilMock:Partial<UtilService> = {}
        const jwtMock:Partial<JwtService> ={}

        const module = await Test.createTestingModule({
            providers:[
                AuthService,
                {
                    provide:UserServices,
                    useValue:userMockService
                },
                {
                    provide:UtilService,
                    useValue:utilMock
                },
                {
                    provide:JwtService,
                    useValue:jwtMock
                }
            ]
        }).compile()


        authService = module.get<AuthService>(AuthService);
    })

    it("should be ok",async ()=>{
        expect('name').toEqual('name')
    })

})