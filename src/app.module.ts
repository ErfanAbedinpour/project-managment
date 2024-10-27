import { Module } from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { join } from 'path';


@Module({
  imports: [ConfigModule.forRoot({cache:true,isGlobal:true,envFilePath:join(__dirname,'..',`.env.${process.env.NODE_ENV}`)}),AuthModule,PrismaModule,UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
