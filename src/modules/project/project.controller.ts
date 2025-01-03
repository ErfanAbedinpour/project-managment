import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UpdateProjectDTO } from './dtos/projects-update.dto';
import { ProjectService } from './project.service';
import { GetUser } from '../auth/decorator/curent-user.decorator';
import { Auth, AuthStrategy } from '../auth/decorator/auth.decorator';
import { ProjectDTO } from './dtos/project.dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @Post()
  createProject(@Body() body: ProjectDTO, @GetUser('id') me: number) {
    try {
      return this.projectService.create(body, me);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  //Get user Repository
  @Auth(AuthStrategy.None)
  @Get(':username')
  getUserRepository(
    @Param('username') username: string,
    @Query('page', ParseIntPipe) page: number,
    @GetUser('username') me: string,
  ) {
    return this.projectService.getRepository({
      username: username,
      page: page || 1,
      isAccessToPrivate: me === username,
    });
  }

  @Auth(AuthStrategy.None)
  @Get(':username:projectName')
  async getProjectByName(
    @Param('projectName') prjName: string,
    @Param('username') username: string,
    @GetUser('username') me: string,
  ) {
    return this.projectService.getProjectByName({
      projectName: prjName,
      username: username,
      isAccessToPrivate: me === username,
    });
  }

  @Patch(':projectName')
  updateProject(
    @Param('projectName') prjName: string,
    @Body() body: UpdateProjectDTO,
    @GetUser('id') me: number,
  ) {
    return this.projectService.updateProject({ data: body, prjName: prjName, userId: me });
  }

  @Delete(':projectName')
  async deleteProject(@Param('projectName') prjName: string, @GetUser('id') me: number) {
    return this.projectService.deleteProject(me, prjName);
  }
}
