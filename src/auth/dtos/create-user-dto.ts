import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

@ApiSchema({ name: 'CreateUserBody' })
export class CreateUserDTO {
  //email
  @ApiProperty({
    description: 'user email',
    type: 'string',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
  //password
  @MinLength(8)
  @ApiProperty({
    description: 'user password',
    minLength: 8,
    maxLength: 80,
    type: 'string',
  })
  @MaxLength(80)
  @IsNotEmpty()
  password: string;
  //username
  @MaxLength(50)
  @ApiProperty({
    description: 'unique username',
    minLength: 3,
    maxLength: 50,
    type: 'string',
  })
  @MinLength(3)
  @IsNotEmpty()
  username: string;
  @MaxLength(80)
  @ApiProperty({
    description: 'display name for show ',
    minLength: 3,
    maxLength: 80,
    type: 'string',
  })
  @MinLength(3)
  @IsNotEmpty()
  display_name: string;
}
