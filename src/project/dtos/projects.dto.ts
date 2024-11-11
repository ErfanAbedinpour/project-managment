import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";
import { PROJECT_STATUS } from "../../type/enums";

export class ProjectDTO{
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    name:string;
    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(100)
    describtion:string;
    @IsEnum(PROJECT_STATUS)
    status:PROJECT_STATUS;
    @IsDate()
    @IsOptional()
    startDate:Date
    @IsDate()
    @IsOptional()
    endDate:Date
    @IsOptional()
    @IsBoolean()
    isPubluc:boolean
}