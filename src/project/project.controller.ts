import { Body, Controller, Delete, Get, InternalServerErrorException, Patch, Post, UseGuards } from '@nestjs/common';
import { IsAuth } from '../auth/auth.guard';
import { ProjectDTO } from './dtos/projects.dto';
import { AccessTokenPyload } from '../userToken/dtos/token.dto';
import { ProjectService } from './project.service';
import { CurentUser } from '../user/user.decorator';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService:ProjectService){}
  @Post()
  @UseGuards(IsAuth)
  createProject(@Body() body:ProjectDTO,@CurentUser() me:AccessTokenPyload) {
    try{
      return this.projectService.create(body,me.id);
    }catch(err){
      throw new InternalServerErrorException(err.message);
    }
  }

  @Get()
  getProject() {}

  @Patch()
  updateProject() {}

  @Delete()
  deleteProject() {}
}
