import { BadGatewayException, BadRequestException, Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { IsAuth } from '../auth/auth.guard';
import { ProjectDTO, UpdateProjectDTO } from './dtos/projects.dto';
import { AccessTokenPyload } from '../userToken/dtos/token.dto';
import { ProjectService } from './project.service';
import { CurentUser } from '../user/user.decorator';

import { Project } from '@prisma/client';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }
  @UseGuards(IsAuth)
  @Post()
  createProject(@Body() body: ProjectDTO, @CurentUser() me: AccessTokenPyload) {
    try {
      return this.projectService.create(body, me.id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  //Get user Repository
  @Get("/:username")
  getUserRepository(@Param("username") username: string, @Query("page", ParseIntPipe) page: number, @CurentUser() me: AccessTokenPyload) {
    return this.projectService.getProjectsByUsername({ username: username, page: page || 1, isAccessToPublic: me?.username === username },)
  }

  @Get("/:username/:name")
  async getProjectByName(@Param("name") name: string, @Param("username") username: string, @CurentUser() me: AccessTokenPyload) {
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
  @UseGuards(IsAuth)
  updateProject(@Param("id", ParseIntPipe) id: number, @Body() body: UpdateProjectDTO, @CurentUser() me: AccessTokenPyload) {
    return this.projectService.updateProject({ data: body, projectId: id, username: me.username });
  }

  @Delete("/:id")
  @UseGuards(IsAuth)
  deleteProject(@Param("id", ParseIntPipe) id: number, @CurentUser() me: AccessTokenPyload) {
    return this.projectService.deleteProject(id, me.username);
  }
}
