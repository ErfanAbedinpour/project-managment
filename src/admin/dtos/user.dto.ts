import { IsNotEmpty, IsString } from "class-validator";
import { CreateUserDTO } from "../../auth/dtos/auth.dto";
import { USER_ROLE } from "../../type/enums";

export class UserDTO extends CreateUserDTO{
    @IsString()
    @IsNotEmpty()
    role:USER_ROLE
}