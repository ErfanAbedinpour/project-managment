import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) { }
  create(projectId: number, createTaskDto: CreateTaskDto) {
    return 'This action adds a new task';
  }

  findAll(projectId: number) {
    return `This action returns all task`;
  }

  findOne(projectId: number, taskId: number) {
    return `This action returns a #${projectId} task`;
  }

  update(projectId: number, taskId: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${projectId} task`;
  }

  remove(projectId: number, id: number) {
    return `This action removes a #${projectId} task`;
  }
}
