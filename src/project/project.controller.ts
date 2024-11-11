import { Body, Controller, Delete, Get, InternalServerErrorException, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { IsAuth } from '../auth/auth.guard';
import { ProjectDTO } from './dtos/projects.dto';
import { AccessTokenPyload } from '../userToken/dtos/token.dto';
import { ProjectService } from './project.service';
import { CurentUser } from '../user/user.decorator';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService:ProjectService){}

  @UseGuards(IsAuth)
  @Post()
  createProject(@Body() body:ProjectDTO,@CurentUser() me:AccessTokenPyload) {
    try{
      return this.projectService.create(body,me.id);
    }catch(err){
      throw new InternalServerErrorException(err.message);
    }
  }

  @Get("/repository")
  @UseGuards(IsAuth)
  getMyRepository(@CurentUser() me:AccessTokenPyload,@Query("page") page:string) {
    return this.projectService.getProjects({ownerId:me.id},Number(page || 1))
  }

  @Get("/:username/repository")
  getUserRepository(@Param("username") username:string ,@Query("page") page:string) {
    return this.projectService.getProjects({owner:{username:username},isPublic:true},Number(page || 1))
  }

  @Patch()
  updateProject() {}

  @Delete()
  deleteProject() {}
}
