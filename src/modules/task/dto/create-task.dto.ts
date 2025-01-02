import { $Enums } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateTaskDto {
    @MinLength(8)
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsEnum($Enums.TaskStatus)
    @IsOptional()
    status: $Enums.TaskStatus

    @MinLength(10)
    @IsString()
    @IsNotEmpty()
    description: string;
}
