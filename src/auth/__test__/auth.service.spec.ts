import { Test } from "@nestjs/testing";
import { AuthService } from "../auth.service";
import { UserServices } from "../../user/user.service";
import { UtilService } from "../../util/util.service";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { CreateUserDTO } from "../dtos/auth.dto";
import { log } from "console";




describe('Auth Service ',()=>{
    let authService:AuthService;
    const userMockService:Partial<UserServices> ={
        user:jest.fn(),
        users:jest.fn(),
        createUser:jest.fn(),
        deleteUser:jest.fn(),
        updateUser:jest.fn(),
    }
    const utilMock:Partial<UtilService> = {
        hash:jest.fn(),
        verify:jest.fn()
    }
    const jwtMock:Partial<JwtService> ={
        signAsync:jest.fn(),
        verifyAsync:jest.fn()
    }


    beforeEach(async ()=>{
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

    describe("Register",()=>{
        it("should be throw BadRequest for duplicated email",async ()=>{
            const fakeUser = {
                email:"fake@gmail.com",
                username:"mmd",
                id:1
            } as User

            jest.spyOn(userMockService,"user")
                .mockImplementationOnce(({email})=>Promise.resolve({...fakeUser,email} as User))
            
            const registerResult = authService.register(fakeUser)

            await expect(registerResult)
                .rejects.toThrow(BadRequestException)
            
            await expect(registerResult).rejects.toThrow("email already taken.")
        })


        it('should be throw BadRequest for duplicate username',async ()=>{
            const fakeUser = {
                email:"fake@gmail.com",
                username:"mmd",
                id:1
            } as User

            // first call return null 
            jest.spyOn(userMockService,"user")
                .mockImplementationOnce(()=>Promise.resolve(null))
            // second call return User
            jest.spyOn(userMockService,"user")
                .mockImplementationOnce(()=>Promise.resolve(fakeUser))

            
            const registerResult = authService.register(fakeUser)

            await expect(registerResult).rejects.toThrow(BadRequestException)

            await expect(registerResult).rejects.toThrow("username already taken.")
        })

        it("should be created succesfully",async ()=>{
            const user:CreateUserDTO= {
                username:"erfan",
                email:"erfan@gmail.com",
                password:"12341234",
                display_name:"mmdi",
            }
            jest.spyOn(userMockService,'user') 
            .mockImplementation(()=>Promise.resolve(null))

            jest.spyOn(utilMock,'hash')
                .mockImplementationOnce((password:string)=>{
                    const hashPass = password+'$';
                    user.password = hashPass
                    return Promise.resolve(hashPass)
                })

            const registerResult = await authService.register(user)
            expect(user.password).toStrictEqual("12341234$")
            expect(userMockService.createUser).toHaveBeenCalledWith({
                username:user.username,
                email:user.email,
                password:user.password,
                display_name:user.display_name,
            })
            expect(registerResult).toBe(true)

        })
    })


    describe("Login", ()=>{
       let user = {
        username:"username",
        password:"passwrod",
        email:"email@email.com",
        display_name:"display_name",
        role:"ADMIN",
        id:1
       } as User
       it('should be throw notFound for user identify was wrong',async ()=>{

            jest.spyOn(userMockService,'user')
                .mockImplementationOnce(()=>Promise.resolve(null))
            
            const loginRes = authService.login({identify:user.username,password:user.password})
            expect(loginRes)
                .rejects.toThrow(NotFoundException)
            expect(loginRes)
                .rejects.toThrow("user does not found")
       }) 


       it('should be throw BadRequest for wrong identify or password',async ()=>{
            jest.spyOn(userMockService,'user')
                .mockImplementationOnce(()=>Promise.resolve(user))

            jest.spyOn(utilMock,'verify')
                .mockImplementationOnce(()=>Promise.resolve(false))

            const loginRes = authService.login({identify:user.username,password:user.password})
            await expect(loginRes).rejects.toThrow(BadRequestException)


            await expect(loginRes).rejects.toThrow("identify or password are incorrect")
       })


       it("should be login succesfully",async ()=>{
            jest.spyOn(userMockService,'user')
                .mockImplementationOnce(()=>Promise.resolve(user))
            
            const token= String(Math.ceil(Math.random()*1000));

            jest.spyOn(jwtMock,'signAsync')
                .mockImplementationOnce((payLoad)=>Promise.resolve(token))
            
            jest.spyOn(utilMock,'verify').mockImplementationOnce(()=>Promise.resolve(true))

            const loginRes = await authService.login({identify:user.username,password:user.password});
            // token paylaod
            const payload = {
                username:user.username,
                email:user.email,
                role:user.role,
                id:user.id,
                display_name:user.display_name
            }

            // call singAsync 
            expect(jwtMock.signAsync).toHaveBeenCalledWith(payload)

            expect(loginRes).toEqual({
                user,
                accessToken:token
            })
       })
    })


})