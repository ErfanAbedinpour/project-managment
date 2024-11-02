import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';

@Controller('project')
export class ProjectController {
  @Post()
  createProject() {}

  @Get()
  getProject() {}

  @Patch()
  updateProject() {}

  @Delete()
  deleteProject() {}
}
