import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ProjectService } from '../project/project.service';
import { UserServices } from '../user/user.service';
import { userInfo } from 'os';
import { retry, throwError } from 'rxjs';
import { Project, ProjectContributer } from '@prisma/client';
import { ProjectController } from 'src/project/project.controller';

@Injectable()
export class ContributeService {
  private readonly projectNotFoundErr = 'project not found';
  private readonly userNotFoundErr = 'user does not found';
  private readonly CannotAccessThisProject =
    'you cannot access To this project';
  private readonly ContributerDoesNotFound =
    'this user does not contribute on this project';
  private readonly userAlreadyContributed = 'user already contributed';
  private readonly logger = new Logger(ContributeService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly projectService: ProjectService,
    private readonly userService: UserServices,
  ) {}

  private async isUserContributed(params: {
    userId: number;
    projectId: number;
  }): Promise<boolean> {
    const { userId, projectId } = params;
    return !!(await this.prisma.projectContributer.findFirst({
      where: { userId, projectId },
    }));
  }

  async contributeToNewProject(params: {
    userId: number;
    projectName: string;
    username: string;
  }): Promise<{ success: boolean }> {
    const { userId, projectName, username } = params;
    // check project is exist or not

    const project = await this.projectService.getProjectByName({
      username: username,
      name: projectName,
      isAccessToPrivate: false,
    });

    // if project does not exist throw error
    if (!project) throw new NotFoundException(this.projectNotFoundErr);

    if (userId === project.ownerId)
      throw new BadRequestException(
        'You cannot contribute on your own project',
      );

    // if user already contribute on the project

    if (await this.isUserContributed({ userId, projectId: project.id }))
      throw new ConflictException(this.userAlreadyContributed);

    try {
      // if not start process
      await this.prisma.projectContributer.create({
        data: {
          userId: userId,
          projectId: project.id,
        },
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError)
        throw new BadRequestException(err.meta.cause);

      this.logger.error(err);
      throw new InternalServerErrorException();
    }
    return { success: true };
  }

  async getProjectContributers(params: {
    projectName: string;
    username: string;
    userId?: number;
  }) {
    const { userId, projectName, username } = params;

    try {
      const project = await this.projectService.getProjectByName({
        isAccessToPrivate: true,
        name: projectName,
        username: username,
      });

      if (!project) throw new NotFoundException(this.projectNotFoundErr);

      if (!project.isPublic && project.ownerId !== userId)
        throw new UnauthorizedException(this.CannotAccessThisProject);

      const contributers = await this.prisma.projectContributer.findMany({
        where: {
          projectId: project.id,
        },

        include: {
          user: {
            select: {
              username: true,
              profile: true,
              id: true,
              display_name: true,
            },
          },
        },
      });

      return contributers;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  private deleteContributer(
    userId: number,
    projectId: number,
  ): Promise<ProjectContributer | null> {
    return this.prisma.projectContributer.delete({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });
  }

  async kickContributer(params: {
    owner: number;
    projectName: string;
    username: string;
    userId: number;
  }) {
    const { userId, projectName, username, owner } = params;
    try {
      const project = await this.projectService.getProjectByName({
        username: username,
        isAccessToPrivate: true,
        name: projectName,
      });

      if (project.ownerId !== owner)
        throw new UnauthorizedException(this.CannotAccessThisProject);

      const isContributerInThisProject =
        await this.prisma.projectContributer.findFirst({
          where: {
            projectId: project.id,
            userId: userId,
          },
        });

      if (!isContributerInThisProject)
        throw new BadRequestException(this.ContributerDoesNotFound);

      const result = await this.deleteContributer(userId, project.id);
      return result;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      this.logger.error(err);
    }
  }
}
