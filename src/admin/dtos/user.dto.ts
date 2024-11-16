import { IsNotEmpty, IsString } from "class-validator";
import { USER_ROLE } from "../../type/enums";
import { CreateUserDTO } from "../../auth/dtos/create-user-dto";

export class UserDTO extends CreateUserDTO {
    @IsString()
    @IsNotEmpty()
    role: USER_ROLE
}