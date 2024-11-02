import { Injectable } from '@nestjs/common';
import { Prisma, Project } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  create(project: Prisma.ProjectCreateInput): Promise<Project> {
    return this.prisma.project.create({ data: project });
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