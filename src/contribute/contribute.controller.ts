import { Controller, Delete, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { ContributeService } from "./contribute.service";
import { IsAuth } from "../gurad/auth.guard";
import { CurentUser } from "../user/user.decorator";
import { AccessTokenPyload } from "../userToken/dtos/token.dto";
import { ContributeParam } from "./dtos/contribute.dto";



@Controller("project/:username/:projectName/contribute")
@UseGuards(IsAuth)
export class ContributeController {
    constructor(private readonly service: ContributeService) { }

    @Post()
    joinedToProejct(@Param() param: ContributeParam, @CurentUser() me: AccessTokenPyload) {
        return this.service.contributeToNewProject({ projectName: param.projectName, userId: me.id, username: param.username });
    }

    @Delete()
    leftFromProject() { }

    @Delete(":userId")
    kickFromProject() { }
}