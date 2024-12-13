import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetUser } from '../auth/decorator/curent-user.decorator';

@Controller('task/:projectId')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @Post()
  create(@GetUser('id') userId: number, @Param("projectId", ParseIntPipe) projectId: number, @Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(userId, projectId, createTaskDto);
  }

  @Get()
  findAll(@Param("projectId", ParseIntPipe) projectId: number) {
    return this.taskService.findAll(projectId);
  }

  @Get(':id')
  findOne(@Param("projectId", ParseIntPipe) projectId: number, @Param('id', ParseIntPipe) taskId: number) {
    return this.taskService.findOne(projectId, taskId);
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
