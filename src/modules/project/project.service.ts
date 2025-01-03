import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Project } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UserServices } from '../user/user.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UpdateProjectDTO } from './dtos/projects-update.dto';
import { ProjectDTO } from './dtos/project.dto';
import { UserProjectsDTO } from './dtos/user-projects.dto';
import { ErrorMessages } from '../../ResponseMessages/ErrorMessages';

@Injectable()
export class ProjectService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserServices,
  ) { }

  async create(project: ProjectDTO, userId: number): Promise<Project> {
    const isThisNameValid = await this.prisma.project.findFirst({
      where: { AND: [{ ownerId: userId }, { name: project.name }] },
    });

    if (isThisNameValid) throw new BadRequestException(ErrorMessages.INVALID_NAME);

    try {
      const result = await this.prisma.project.create({
        data: {
          status: project.status,
          name: project.name,
          description: project.describtion,
          isPublic: project.isPublic,
          owner: {
            connect: {
              id: userId,
            },
          },
        },
        include: { owner: { select: { role: true } } },
      });
      return result;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError)
        throw new BadRequestException(ErrorMessages.DB_ERROR);

      throw new InternalServerErrorException();
    }
  }

  async getRepository(params: {
    username: string;
    isAccessToPrivate: boolean;
    page: number;
  }): Promise<UserProjectsDTO> {
    let { page, username, isAccessToPrivate } = params;

    let where: Prisma.ProjectWhereInput = {
      owner: { username },
    };

    let take = 10;
    let skip = (page - 1) * take;
    // check user if itself request to this router send all project include private and public if not return just public project
    if (!isAccessToPrivate) where.isPublic = true;

    const totalRow = await this.prisma.project.count({ where });
    const totalpages = Math.ceil(totalRow / take);

    const projects = await this.prisma.project.findMany({
      take,
      skip,
      where,
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            display_name: true,
            profile: true,
            role: true,
          },
        },
      },
    });

    return {
      projects,
      meta: { totalpages, totalProjects: totalRow, page: page },
    };
  }

  async getProjectByName(params: {
    username: string;
    projectName: string;
    isAccessToPrivate: boolean;
  }): Promise<Project> {
    const { username, projectName, isAccessToPrivate } = params;

    const user = await this.userService.getUserByUsername(username);

    if (!user) throw new NotFoundException(ErrorMessages.USER_NOT_FOUND);

    const where: Prisma.ProjectWhereInput = {
      AND: [
        {
          name: projectName,
        },
        {
          ownerId: user.id,
        },
      ],
    };

    // if user itself request and if project is private throw not found error
    if (!isAccessToPrivate) where.isPublic = true;

    const project = await this.prisma.project.findFirst({
      include: {
        owner: {
          select: {
            username: true,
            display_name: true,
            profile: true,
            id: true,
          },
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
              },
            },
          },
        },
      },
      where,
    });

    if (!project)
      throw new NotFoundException(ErrorMessages.PROJECT_NOT_FOUND)
    return project
  }

  // delete project
  async deleteProject(userId: number, projectName: string) {
    // find project 
    const project = await this.getProjectById(userId, projectName);
    if (!project) throw new NotFoundException(ErrorMessages.PROJECT_NOT_FOUND);
    // remove project
    try {
      return await this.prisma.project.delete({
        where: { ownerId_name: { name: projectName, ownerId: userId } },
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError)
        throw new NotFoundException(ErrorMessages.DB_ERROR);

      throw new InternalServerErrorException();
    }
  }

  // update project
  async updateProject(params: {
    userId: number;
    prjName: string;
    data: UpdateProjectDTO;
  }) {
    const newPaylod = {};
    const { userId, prjName, data } = params;

    const project = await this.prisma.project.findFirst({
      where: { ownerId: userId, name: prjName },
    });

    if (!project) throw new NotFoundException(ErrorMessages.PROJECT_NOT_FOUND);

    if (data.name) {
      const isNameTaken = await this.getProjectById(userId, prjName);
      // if this name is taken
      if (isNameTaken) throw new BadRequestException(ErrorMessages.INVALID_NAME);
      newPaylod['name'] = data.name;
    }

    try {
      return await this.prisma.project.update({
        where: {
          ownerId_name: {
            name: prjName,
            ownerId: userId,
          },
        },
        data,
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError)
        throw new NotFoundException(ErrorMessages.DB_ERROR);
      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  // find project ById
  getProjectById(userId: number, name: string) {
    return this.prisma.project.findFirst({
      where: {
        AND: [
          {
            name,
          },
          {
            ownerId: userId,
          },
        ],
      },
    });
  }
}
