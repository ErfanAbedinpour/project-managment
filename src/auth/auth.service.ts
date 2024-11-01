import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateUserDTO, LoginUserDTO, TokenPaylaod} from "./dtos/auth.dto";
import {JwtService} from '@nestjs/jwt'
import { UserServices } from "../user/user.service";
import { UtilService } from "../util/util.service";


@Injectable()
export class AuthService{
    constructor(
        private readonly userService:UserServices,
        private readonly util:UtilService,
        private readonly jwt:JwtService
    ){ }

    async register(user:CreateUserDTO){
        try{
            const isEmailTaken = await this.userService.user({email:user.email});
            if(isEmailTaken) 
                throw new BadRequestException('email already taken.');

            const isValidUserNmae = await this.userService.user({username:user.username});
            if(isValidUserNmae) 
                throw new BadRequestException("username already taken.");
            
            const hashPassword = await this.util.hash(user.password);

            await this.userService.createUser({
                username:user.username,
                email:user.email,
                password:hashPassword,
                display_name:user.display_name,
            })
            return true;
        }catch(err){
            throw err;
        }
    }

    async  login({identify,password}:LoginUserDTO){
        try{
            const user = await this.userService.user({OR:[{email:identify},{username:identify}]});
            if(!user)
                throw new BadRequestException("user does not found")

            if(!(await this.util.verify(password,user.password)))
                throw new BadRequestException("identify or password are incorrect")
            
            const payLoad:TokenPaylaod= {
                username:user.username,
                email:user.email,
                role:user.role,
                id:user.id,
                display_name:user.display_name
            }
            return {
                user,
                accessToken: await this.jwt.signAsync(payLoad)
            }
        }catch(err){
            throw err;
        }
    }
}