import { Project } from '@prisma/client';

export class UserProjectsDTO {
  projects: Project[];
  meta: object;
}
