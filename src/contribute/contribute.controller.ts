import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ContributeService } from './contribute.service';
import { ContributeParam } from './dtos/contribute.dto';
import { GetUser } from '../auth/decorator/curent-user.decorator';
import { CurentUser } from '../auth/interface/curent-user.interface';

@Controller('project/:username/:projectName/contribute')
export class ContributeController {
  constructor(private readonly service: ContributeService) {}

  // @Post()
  // joinedToProejct(@Param() param: ContributeParam, @GetUser() me: CurentUser) {
  //     return this.service.contributeToNewProject({ projectName: param.projectName, userId: me.id, username: param.username });
  // }

  @Delete()
  leftFromProject() {}

  @Delete(':userId')
  kickFromProject() {}
}
