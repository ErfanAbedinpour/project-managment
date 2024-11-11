import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { join } from 'path';
import { UserTokenModule} from './userToken/userToken.module';
import { CacheModule } from '@nestjs/cache-manager';
import { MailerModule } from '@nestjs-modules/mailer';
import { IEnvironmentVariables } from './type';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: join(process.cwd(), `.env.${process.env.NODE_ENV}`),
    }),
    AuthModule,
    UserModule,
    UserTokenModule,
    ProjectModule,
    CacheModule.register({
      isGlobal:true,
      ttl:30*60*1000
    }),
    MailerModule.forRootAsync({
      useFactory:(env:ConfigService<IEnvironmentVariables>)=>{
        return {
          transport:{
            // host:env.getOrThrow<string>("EMAIL_HOST"),
            service:'gmail',
            auth:{
              user:env.getOrThrow<string>("EMAIL_USERNAME"),
              pass:env.getOrThrow<string>("EMAIL_PASSWORD") 
            }
          }
        }
      },
      inject:[ConfigService]
    })
   ],
})
export class AppModule {}
