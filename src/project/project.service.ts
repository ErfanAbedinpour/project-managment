import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, Project } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProjectDTO } from './dtos/projects.dto';
import { UserServices } from '../user/user.service';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService,private readonly userService:UserServices) { }

  async create(project: ProjectDTO, userId: number): Promise<Project> {
    const isThisNameValid = await this.prisma.project.findFirst({ where: { AND: [{ ownerId: userId }, { name: project.name }] } });
    if (isThisNameValid)
      throw new BadRequestException("this name in used bu another project please change");

    return this.prisma.project.create({
      data: {
        endDate: project.endDate,
        startDate: project.startDate,
        staus: project.status,
        name: project.name,
        description: project.describtion,
        isPublic: project.isPublic,
        owner: {
          connect: {
            id: userId
          }
        }
      }
    });
  }

  project(where: Prisma.ProjectWhereInput): Promise<Project | null> {
    return this.prisma.project.findFirst({ where });
  }

  async getProjects(where:Prisma.ProjectWhereInput, page: number): Promise<{projects:Project[],meta:object}> {
    let take = 10;
    let skip = (page - 1) * take;

    const totalRow = await this.prisma.project.count();
    const totalpages = Math.ceil(totalRow/take);

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

    return {projects, meta:{totalpages}};
  }

  
  deleteProject(where: Prisma.ProjectWhereUniqueInput) {
    return this.prisma.project.delete({ where });
  }

  updateProject(params: {
    data: Prisma.ProjectCreateInput;
    where: Prisma.ProjectWhereUniqueInput;
  }) {
    const { data, where } = params;
    return this.prisma.project.update({ where, data });
  }
}
