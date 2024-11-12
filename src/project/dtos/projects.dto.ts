import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";
import { PROJECT_STATUS } from "../../type/enums";
import { Type } from "class-transformer";
import { Project } from "@prisma/client";

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
    @Type(()=>Date)
    startDate:Date
    @IsDate()
    @Type(()=>Date)
    endDate:Date
    @IsBoolean()
    isPublic:boolean
}

export class UserProjectsDTO{
    projects:Project[];
    meta:object
}