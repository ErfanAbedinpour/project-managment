import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { PrismaService } from "../prisma/prisma.service";
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ProjectService } from "../project/project.service";
import { UserServices } from "../user/user.service";

@Injectable()
export class ContributeService {
    private readonly projectNotFoundErr = "project not found"
    private readonly userNotFoundErr = "user does not found";
    private readonly userAlreadyContributed = "user already contributed"

    constructor(
        private readonly prisma: PrismaService,
        private readonly projectService: ProjectService,
        private readonly userService: UserServices
    ) { }

    private async isUserContributed(params: { userId: number, projectId: number }): Promise<boolean> {
        const { userId, projectId } = params;
        return !!(await this.prisma.projectContributer.findFirst({ where: { userId, projectId } }));
    }

    async contributeToNewProject(params: { userId: number, projectName: string; username: string }): Promise<{ success: boolean }> {
        const { userId, projectName, username } = params;
        // check project is exist or not 
        const projectPromise = this.projectService.getProjectByName({
            username,
            isAccessToPrivate: false,
            name: projectName
        });
        // user is exist 
        const userPromise = await this.userService.findUserById(userId);

        const [project, user] = await Promise.all([projectPromise, userPromise])

        // if project does not exist throw error
        if (!project)
            throw new NotFoundException(this.projectNotFoundErr);

        // check user exsist or not
        if (!user)
            throw new NotFoundException(this.userNotFoundErr);

        // if user already contribute on the project 

        if (await this.isUserContributed({ userId: user.id, projectId: project.id }))
            throw new BadRequestException(this.userAlreadyContributed)

        try {
            // if not start process
            await this.prisma.projectContributer.create({
                data: {
                    userId: userId,
                    projectId: project.id,
                }
            })

        } catch (err) {
            if (err instanceof PrismaClientKnownRequestError)
                throw new BadRequestException(err.meta.cause)

            console.error(err)
            throw new InternalServerErrorException()
        }
        return { success: true }
    }
}