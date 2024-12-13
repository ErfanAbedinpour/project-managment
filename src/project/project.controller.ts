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
  private readonly NOT_ACCESS = 'you cannot access this Resource.';
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
  @Get('/:username')
  getUserRepository(
    @Param('username') username: string,
    @Query('page', ParseIntPipe) page: number,
    @GetUser('username') me: string,
  ) {
    return this.projectService.getRepository({
      username: username,
      page: page || 1,
      isAccessToPublic: me === username,
    });
  }

  @Auth(AuthStrategy.None)
  @Get('/:username/:name')
  async getProjectByName(
    @Param('name') name: string,
    @Param('username') username: string,
    @GetUser('username') me: string,
  ) {
    try {
      const project = await this.projectService.getProjectByName({
        name,
        username: username,
        isAccessToPrivate: me === username,
      });

      if (!project) throw new NotFoundException('project not found. ');

      return project;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      console.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  @Patch(':name')
  updateProject(
    @Param('name') name: string,
    @Body() body: UpdateProjectDTO,
    @GetUser('id') me: number,
  ) {
    return this.projectService.updateProject({ data: body, name, userId: me });
  }

  @Delete(':name')
  async deleteProject(@Param('name') name: string, @GetUser('id') me: number) {
    return this.projectService.deleteProject(me, name);
  }
}
