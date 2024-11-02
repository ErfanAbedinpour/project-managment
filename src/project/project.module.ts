import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { UserModule } from 'src/user/user.module';
import { ProjectService } from './project.service';

@Module({
  controllers: [ProjectController],
  imports: [UserModule],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
