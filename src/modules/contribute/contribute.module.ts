import { Module } from '@nestjs/common';
import { ContributeController } from './contribute.controller';
import { ContributeService } from './contribute.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ProjectModule } from '../project/project.module';
import { UserModule } from '../user/user.module';
import { UserTokenModule } from '../userToken/userToken.module';

@Module({
  imports: [PrismaModule, ProjectModule, UserModule, UserTokenModule],
  controllers: [ContributeController],
  providers: [ContributeService],
})
export class ContributeModule { }
