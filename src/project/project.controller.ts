import { BadGatewayException, BadRequestException, Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ProjectDTO, UpdateProjectDTO } from './dtos/projects.dto';
import { ProjectService } from './project.service';
import { Project } from '@prisma/client';
import { GetUser } from '../auth/decorator/curent-user.decorator';
import { CurentUser } from '../auth/interface/curent-user.interface';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }
  @Post()
  createProject(@Body() body: ProjectDTO, @GetUser() me: CurentUser) {
    try {
      return this.projectService.create(body, me.id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  //Get user Repository
  @Get("/:username")
  getUserRepository(@Param("username") username: string, @Query("page", ParseIntPipe) page: number, @GetUser() me: CurentUser) {
    return this.projectService.getUserRepositoryByUsername({ username: username, page: page || 1, isAccessToPublic: me?.username === username },)
  }

  @Get("/:username/:name")
  async getProjectByName(@Param("name") name: string, @Param("username") username: string, @GetUser() me: CurentUser) {
    try {
      const project = await this.projectService.getProjectByName({ name, username, isAccessToPrivate: me?.username === username });

      if (!project)
        throw new NotFoundException("project not found");

      return project

    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(err.message)
    }
  }

  @Patch("/:id")
  updateProject(@Param("id", ParseIntPipe) id: number, @Body() body: UpdateProjectDTO, @GetUser() me: CurentUser) {
    return this.projectService.updateProject({ data: body, projectId: id, username: me.username });
  }

  @Delete("/:id")
  deleteProject(@Param("id", ParseIntPipe) id: number, @GetUser() me: CurentUser) {
    return this.projectService.deleteProject(id, me.username);
  }
}
