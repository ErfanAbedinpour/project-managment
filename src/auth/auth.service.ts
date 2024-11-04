import { BadRequestException, ForbiddenException, Injectable, NotFoundException, } from "@nestjs/common";
import {  CreateUserDTO, LoginUserDTO} from "./dtos/auth.dto";
import { UserServices } from "../user/user.service";
import { UtilService } from "../util/util.service";
import { UserTokenService } from "../userToken/userToken.service";
import { JwtCustomeService } from "../userToken/jwt.service";
import { JsonWebTokenError } from "@nestjs/jwt";


@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserServices,
        private readonly util: UtilService,
        private readonly userTokenService:UserTokenService,
        private readonly jwtService:JwtCustomeService

    ) { }

    async register(user: CreateUserDTO):Promise<{success:boolean}> {
        try {
            const isEmailTaken = await this.userService.user({ email: user.email });
            if (isEmailTaken)
                throw new BadRequestException('email already taken.');

            const isValidUserNmae = await this.userService.user({ username: user.username });
            if (isValidUserNmae)
                throw new BadRequestException("username already taken.");

            const hashPassword = await this.util.hash(user.password);

            await this.userService.createUser({
                username: user.username,
                email: user.email,
                password: hashPassword,
                display_name: user.display_name,
            })
            return {success:true}
        } catch (err) {
            throw err;
        }
    }

    async login({ identify, password }: LoginUserDTO):Promise<{accessToken:string;refreshToken:string}> {
        try {
            const user = await this.userService.user({ OR: [{ email: identify }, { username: identify }] });

            if (!user)
                throw new NotFoundException("user does not found")


            if (!(await this.util.verify(password, user.password)))
                throw new BadRequestException("identify or password are incorrect")

            // generate tokens
            const accessToken =await  this.jwtService.signAccessToken({
                username:user.username,
                role:user.role,
                id:user.id
            })
            
            const refreshToken = await this.jwtService.signRefreshToken({
                id:user.id
            })
            
            await this.userTokenService.create({token:refreshToken,userId:user.id});

            return {
                accessToken,
                refreshToken
            }
        } catch (err) {
            throw err;
        }
    }


    async logOut(refreshToken:string):Promise<{success:boolean}>{
        try{
            await this.userTokenService.deleteToken({token:refreshToken});
            return {success:true}
        }catch(err){
            if(err instanceof JsonWebTokenError){
                throw new ForbiddenException("token is invalid. ")
            }
            console.error(err)
        }
    }
}