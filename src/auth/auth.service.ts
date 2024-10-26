import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateUserDTO } from "./dtos/auth.dto";
import { UserServices } from "src/user/user.service";
import { UtilService } from "src/util/util.service";



@Injectable()
export class AuthService{
    constructor(private readonly userService:UserServices,private readonly util:UtilService){ }

    async register(user:CreateUserDTO){
        try{
            const isEmailTaken = await this.userService.user({email:user.email});
            if(isEmailTaken) 
                throw new BadRequestException('email already taken.');

            const isValidUserNmae = await this.userService.user({username:user.username});
            if(isValidUserNmae) 
                throw new BadRequestException("username already taken.");
            
            const hashPassword = await this.util.hash(user.password);

            const newUser= await this.userService.createUser({
                username:user.username,
                email:user.email,
                password:hashPassword,
                display_name:user.display_name,
            })
            return newUser;
        }catch(err){
            throw new InternalServerErrorException(err.message);
        }
    }
}