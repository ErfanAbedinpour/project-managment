import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, Project } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProjectDTO } from './dtos/projects.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async create(project: ProjectDTO,userId:number): Promise<Project> {
    const isThisNameValid = await this.prisma.project.findFirst({where:{AND:[{ownerId:userId},{name:project.name}]}});
    if(isThisNameValid)
      throw new BadRequestException("this name in used bu another project please change");

    return this.prisma.project.create({
      data:{
        endDate:project.endDate ,
        startDate:project.startDate ,
        staus:project.status,
        name:project.name,
        description:project.describtion,
        isPublic:project.isPublic,
        owner:{
          connect:{
            id:userId
          }
        }
      }
     });
  }

  project(where: Prisma.ProjectWhereInput): Promise<Project | null> {
    return this.prisma.project.findFirst({ where });
  }

  projects(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProjectWhereUniqueInput;
    where?: Prisma.ProjectWhereInput;
    orderBy?: Prisma.ProjectOrderByWithRelationInput;
  }): Promise<Project[]> {
    const { skip, take, orderBy, cursor, where } = params;
    return this.prisma.project.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
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
