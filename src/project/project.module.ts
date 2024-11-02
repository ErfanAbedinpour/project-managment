import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [ProjectController],
  imports: [UserModule],
})
export class ProjectModule {}
