import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Prisma, Project } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProjectDTO, UpdateProjectDTO } from './dtos/projects.dto';
import { UserServices } from '../user/user.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService, private readonly userService: UserServices) { }

  async create(project: ProjectDTO, userId: number): Promise<Project> {
    const isThisNameValid = await this.prisma.project.findFirst({ where: { AND: [{ ownerId: userId }, { name: project.name }] } });
    if (isThisNameValid)
      throw new BadRequestException("this name in used bu another project please change");

    try {
      const result = await this.prisma.project.create({
        data: {
          status: project.status,
          name: project.name,
          description: project.describtion,
          isPublic: project.isPublic,
          owner: {
            connect: {
              id: userId
            },
          }
        },
        include: { owner: { select: { role: true } } }
      })
      return result

    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError)
        throw new BadRequestException(err.meta.cause);

      throw new InternalServerErrorException()
    }
  }

  async getUserRepositoryByUsername(params: { username: string, isAccessToPublic: boolean, page: number }): Promise<{ projects: Project[], meta: object }> {
    let { page, username, isAccessToPublic } = params;
    let where: Prisma.ProjectWhereInput = {
      owner: { username }
    }
    let take = 10;
    let skip = (page - 1) * take;
    // check user if itself request to this router send all project include private and public if not return just public project
    if (!isAccessToPublic) {
      where.isPublic = true
    }
    const totalRow = await this.prisma.project.count({ where });
    const totalpages = Math.ceil(totalRow / take);

    const projects = await this.prisma.project.findMany({
      take,
      skip,
      where: where,
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            display_name: true,
            profile: true,
            role: true,
          }
        },
      }
    })

    return { projects, meta: { totalpages, totalProjects: totalRow, page: page } };

  }

  getProjectByName(params: { username: string, name: string, isAccessToPrivate: boolean }): Promise<Project> {
    const { username, name, isAccessToPrivate } = params;
    const where: Prisma.ProjectWhereInput = {
      name: name,
      owner: { username }
    }

    // if user itself request and if project is private throw not found error 
    if (!isAccessToPrivate)
      where.isPublic = true

    return this.prisma.project.findFirst({
      include: {
        owner: {
          select: {
            username: true,
            display_name: true,
            profile: true,
            id: true,
          }
        },
        Task: {
          select: {
            title: true,
            id: true,
            status: true,
            User: {
              select: {
                username: true,
                profile: true,
                id: true,
                display_name: true,
                createdAt: true,
              }
            }

          }
        }
      },
      where: {
        name: name,
      }
    })
  }

  async deleteProject(id: number, username: string) {
    try {
      return await this.prisma.project.delete({ where: { id, owner: { username } } });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError)
        throw new NotFoundException(err.meta.cause)
      throw new InternalServerErrorException()
    }
  }

  async updateProject(params: {
    username: string;
    projectId: number;
    data: UpdateProjectDTO
  }) {
    const { username, projectId, data } = params;
    // check project name is unique or not
    if (data.name) {
      const isNameIsTaken = !!await this.prisma.project.findFirst({
        where: { name: data.name, owner: { username } }
      })
      if (isNameIsTaken)
        throw new BadRequestException("name is taken by another. please chose another");
    }

    try {

      return await this.prisma.project.update({
        where: {
          id: projectId,
          owner: { username }
        }, data
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError)
        throw new NotFoundException(err.meta.cause)

      throw new InternalServerErrorException()
    }
  }
}
