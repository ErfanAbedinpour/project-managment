import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserTokenModule } from '../userToken/userToken.module';
import { UserServices } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Authorization } from '../interceptor/auth.interceptor';

@Module({
  controllers: [ProjectController],
  imports: [PrismaModule, UserTokenModule, UserModule],
  providers: [ProjectService, {
    provide: APP_INTERCEPTOR,
    useClass: Authorization
  }],
  exports: [ProjectService],
})
export class ProjectModule { }
