import { Test } from "@nestjs/testing";
import { AuthService } from "../auth.service";
import { UserServices } from "../../user/user.service";
import { UtilService } from "../../util/util.service";
import { JwtService } from "@nestjs/jwt";
import { Prisma, User, UserToken } from "@prisma/client";
import { BadRequestException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CreateUserDTO } from "../dtos/auth.dto";
import { UserTokenService } from "../../userToken/userToken.service";
import { JwtCustomeService } from "../../userToken/jwt.service";




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

    const jwtMock:Partial<JwtCustomeService> ={
        signAccessToken:jest.fn(),
        signRefreshToken:jest.fn(),
        verifyAccessToken:jest.fn(),
        verifyRefreshToken:jest.fn()
    }

    const mockuserTokenService:Partial<UserTokenService> = {
        create:jest.fn(),
        deleteToken:jest.fn(),
        getUserByToken:jest.fn(),
        updateToken:jest.fn()
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
                    provide:JwtCustomeService,
                    useValue:jwtMock
                },
                {
                    provide:UserTokenService,
                    useValue:mockuserTokenService
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
            expect(registerResult).toEqual({success:true})

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
            
            const accessToken= String(Math.ceil(Math.random()*1000));

            const refreshToken= String(Math.ceil(Math.random()*1000));


            jest.spyOn(jwtMock,'signAccessToken')
                .mockImplementationOnce((payLoad)=>Promise.resolve(accessToken))
            
            jest.spyOn(jwtMock,'signRefreshToken')
                .mockImplementationOnce((payLoad)=>Promise.resolve(refreshToken))

            jest.spyOn(utilMock,'verify').mockImplementationOnce(()=>Promise.resolve(true))

            
            const loginRes = await authService.login({identify:user.username,password:user.password});

            expect(mockuserTokenService.create).toHaveBeenCalledWith({token:refreshToken,userId:user.id})

            expect(jwtMock.signAccessToken).toHaveBeenCalledWith({
                id:user.id,
                role:user.role,
                username:user.username
            })

            expect(jwtMock.signRefreshToken).toHaveBeenCalledWith({
                id:user.id,
            })

            expect(loginRes).toEqual({
                accessToken:accessToken,
                refreshToken:refreshToken
            })
       })
    })

    it("logOut",async ()=>{
        const refreshToken = String(Math.ceil(Math.random()*1000));
        const result = await authService.logOut(refreshToken);
        expect(mockuserTokenService.deleteToken).toHaveBeenCalledWith({token:refreshToken})
        expect(result).toEqual({success:true})
    })


    describe("refreshToken",()=>{
        it("should be throw UnauthorizedException Error for invaid token",async ()=>{

           jest.spyOn(mockuserTokenService,'getUserByToken')
            .mockResolvedValue(null)
            await expect(authService.refreshToken("")).rejects.toThrow(UnauthorizedException)

            await expect(authService.refreshToken("")).rejects.toThrow("token is expired or invaid .please login again. ")

        })

        it("should be throw Unaut for token expired.", async ()=>{
            const refreshToken = String(Math.ceil(Math.random()*1000));
            const result:Prisma.UserTokenGetPayload<{ include: { user: {select:{role:true,username:true,id:true}}}}>= {
                expireAt:new Date(Date.now() - 1000),
                token:refreshToken,
                createdAt:new Date(),
                isRevoke:false,
                userId:1,
                int:2,
                user:{
                    role:'ADMIN',
                    username:"erfan",
                    id:1,
                }
            }; 

            jest.spyOn(mockuserTokenService,'getUserByToken')
            .mockResolvedValue(result)

            await expect(authService.refreshToken(refreshToken)).rejects.toThrow(UnauthorizedException)

            await expect(authService.refreshToken(refreshToken)).rejects.toThrow("token is expired or invaid .please login again. ")

        })


        it('Should be return accessToken and refreshToken',async ()=>{

            const refreshToken = String(Math.ceil(Math.random()*1000));

            const accessToken = String(Math.ceil(Math.random()*1000));

            const result:Prisma.UserTokenGetPayload<{ include: { user: {select:{role:true,username:true,id:true}}}}>= {
                expireAt:new Date(Date.now() + 8*24*60*60*1000),
                token:refreshToken,
                createdAt:new Date(),
                isRevoke:false,
                userId:1,
                int:2,
                user:{
                    role:'ADMIN',
                    username:"erfan",
                    id:1,
                }
            }; 
            jest.spyOn(mockuserTokenService,'getUserByToken')
                .mockResolvedValue(result)
            
            jest.spyOn(jwtMock,'signAccessToken')
                .mockResolvedValue(accessToken)

            jest.spyOn(jwtMock,'signRefreshToken')
                .mockResolvedValue(refreshToken)


            const outPut = await authService.refreshToken(refreshToken)

            expect(jwtMock.signAccessToken).toHaveBeenCalledWith({
                role:result.user.role,
                username:result.user.username,
                id:result.user.id
            })
            expect(jwtMock.signRefreshToken).toHaveBeenCalledWith({
                id:result.user.id
            })

            expect(mockuserTokenService.updateToken).toHaveBeenCalled()
            expect(outPut).toEqual({accessToken:accessToken,refreshToken:refreshToken})
            
        })

    })

})