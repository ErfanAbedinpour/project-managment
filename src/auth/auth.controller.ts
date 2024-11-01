import { BadRequestException, Body, ClassSerializerInterceptor, Controller, InternalServerErrorException, Post, UseInterceptors } from "@nestjs/common";
import { CreateUserDTO, LoginUserDTO, UserDTO, } from "./dtos/auth.dto";
import { AuthService } from "./auth.service";
import { LoginResponseDTO } from "./dtos/auth.response.dto";
import { ResponseSerializer } from "../interceptor/response.interceptor";


@Controller('auth')
export class AuthController{
    constructor(private readonly authService:AuthService){}
    @Post("singup")
    register(@Body() body:CreateUserDTO){
        return this.authService.register(body)
        
    }
    @ResponseSerializer(LoginResponseDTO)
    @Post('login')
    login(@Body() body:LoginUserDTO){
        return this.authService.login(body);
    }
}