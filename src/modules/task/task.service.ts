import { ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { $Enums, Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundError } from 'rxjs';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) { }
  private readonly PROJECT_NOT_FOUND = "project not found."
  private readonly TASK_NOT_FOUND = "task not found"
  private readonly NOT_ACCESS_TO_PROJECT = "you cannot access to this project"
  private logger = new Logger(TaskService.name);

  async create(userId: number, projectId: number, { title, description, status }: CreateTaskDto) {
    const project = await this.prisma.project.findFirst({ where: { id: projectId } })
    if (project.ownerId !== userId)
      throw new ForbiddenException(this.NOT_ACCESS_TO_PROJECT)

    if (!project)
      throw new NotFoundException(this.PROJECT_NOT_FOUND)

    try {
      const task = await this.prisma.task.create({
        data: {
          title,
          description,
          status: status ?? $Enums.TaskStatus.INQUEUE,
          ProjectId: project.id,
          userId: userId
        }
      })

      return task;
    } catch (err) {
      this.logger.error(err)
      throw new InternalServerErrorException()
    }

  }

  async findAll(projectId: number) {
    const task = await this.prisma.task.findMany({
      where: {
        ProjectId: projectId,
      },
      include: { User: { select: { username: true, id: true, email: true, profile: true } } }
    })

    return task;
  }

  async findOne(projectId: number, taskId: number) {
    const task = await this.prisma.task.findFirst({
      where: {
        ProjectId: projectId,
        id: taskId
      },
      include: {
        User: {
          select: {
            username: true,
            id: true,
            profile: true,
          }
        },
        Project: true
      }
    });

    if (!task)
      throw new NotFoundException(this.TASK_NOT_FOUND)

    return task;
  }

  update(projectId: number, taskId: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${projectId} task`;
  }

  remove(projectId: number, id: number) {
    return `This action removes a #${projectId} task`;
  }
}
