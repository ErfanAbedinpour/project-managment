import { Test } from "@nestjs/testing"
import { PrismaService } from "../../prisma/prisma.service"
import { UserServices } from "../user.service"
import { Prisma, PrismaClient, User } from "@prisma/client";
import { PrismaModule } from "../../prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { join } from "path";



describe("user Service",()=>{

    let userService:UserServices;

    beforeEach(async ()=>{

        const module = await Test.createTestingModule({
            imports:[ConfigModule.forRoot({
            envFilePath:join(process.cwd(),`.env.test`)}),PrismaModule],
            providers:[UserServices]
        }).compile()
        

        userService = module.get<UserServices>(UserServices);
        
    })

    afterAll(async ()=>{
        const  client = new PrismaClient();
        await client.user.deleteMany() 
        await client.$disconnect();
    })


    it("should be created user",async ()=>{
        let user = {
            username:"mmd",
            email:"erfan@gmail.com",
            password:"12341342",
            display_name:"erfan"
        } as User

        const findUser = await userService.createUser(user);

        expect(findUser.username).toEqual(user.username)
        expect(findUser.email).toEqual(user.email)
        expect(findUser.role).toEqual('USER')
    })
})