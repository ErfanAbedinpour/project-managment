import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetUser } from '../auth/decorator/curent-user.decorator';

@Controller(':username/:projectName/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @Post()
  create(@GetUser('id') userId: number, @Param("username") username: string, @Param("projectName") projectName: string, @Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(userId, username, projectName, createTaskDto);
  }

  @Get()
  findAll(@Param("username") username: string, @Param("projectName") prjName: string) {
    return this.taskService.findAll(username, prjName);
  }

  @Get(':taskID')
  findOne(@Param("username") username: string, @Param('projectName') prjName: string, @Param("taskID", ParseIntPipe) taskId: number) {
    return this.taskService.findOne(username, prjName, taskId);
  }

  @Patch(':id')
  update(@Param("projectId", ParseIntPipe) projectId: number, @Param('id', ParseIntPipe) taskId: number, @Body() body: UpdateTaskDto) {
    return this.taskService.update(projectId, taskId, body);
  }

  @Delete(':id')
  remove(@Param("projectId", ParseIntPipe) projectId: number, @Param('id', ParseIntPipe) id: number) {
    return this.taskService.remove(projectId, id);
  }
}
