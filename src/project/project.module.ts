import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserTokenModule } from '../userToken/userToken.module';

@Module({
  controllers: [ProjectController],
  imports: [PrismaModule,UserTokenModule],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
