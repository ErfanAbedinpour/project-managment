import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserTokenModule } from '../userToken/userToken.module';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [ProjectController],
  imports: [PrismaModule, UserTokenModule, UserModule],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule { }
