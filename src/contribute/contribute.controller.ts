import {
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { ContributeService } from './contribute.service';
import { GetUser } from '../auth/decorator/curent-user.decorator';
import { Auth, AuthStrategy } from '../auth/decorator/auth.decorator';

@Controller('project/:username/:projectName/contribute')
export class ContributeController {
  constructor(private readonly service: ContributeService) { }

  @Post()
  contributeToProject(@Param("username") username: string, @Param("projectName") name: string, @GetUser("id") userId: number) {
    return this.service.contributeToNewProject({ username, userId, projectName: name });
  }

  @Auth(AuthStrategy.None)
  @Get()
  getProjectContributers(@Param("projectName") name: string, @Param("username") username: string, @GetUser('id') me: number) {
    return this.service.getProjectContributers({ username, projectName: name, userId: me })
  }


}
