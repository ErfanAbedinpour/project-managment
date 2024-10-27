import { UserServices } from "src/user/user.service";
import { AuthService } from "../auth.service";
import { UtilService } from "src/util/util.service";
import { Test } from "@nestjs/testing";
import { PrismaModule } from "src/prisma/prisma.module";


let authService:AuthService

describe('Auth Service Test',()=>{
    beforeEach(async ()=>{
        const mockUserService:Partial<UserServices> = {}

        // const mockUtilService:Partial<UtilService> = {
        //     hash:()=>Promise.resolve("myPassword"),
        //     verify:()=>Promise.resolve(true)
        // }
        const module= await Test.createTestingModule({
            imports:[
                PrismaModule
            ],
            providers:[
                AuthService,
                // {
                //     provide:UserServices,
                //     useValue:mockUserService
                // },
                // {
                //     provide:UtilService,
                //     useValue:mockUtilService
                // }
            ]
        }).compile()

        authService = module.get(AuthService);
    })

    it("should be singUp curectly",async ()=>{
        expect('name').toEqual('name');
    })
})