import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';


export class LoginUserDTO {
    @ApiProperty({
        examples: {
            email: { values: "example.test@gmail.com" },
            username: { values: "myUsername" }
        },
        description: "username or email",
        type: 'string'
    })
    @IsString()
    @IsNotEmpty()
    identify: string; // email or username
    @IsString()
    @ApiProperty({ description: "password" })
    @MinLength(8)
    @MaxLength(80)
    password: string;
}