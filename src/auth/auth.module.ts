import {Module} from '@nestjs/common'
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config'
import { UserModule } from '../user/user.module';
import { UtilModule } from '../util/util.module';
import { IEnvironmentVariables } from '../type';
import { PrismaModule } from '../prisma/prisma.module';


@Module({
    imports:[UserModule,PrismaModule,UtilModule,JwtModule.registerAsync({
        useFactory:async (config:ConfigService<IEnvironmentVariables>)=> {
            return {
                secret:config.getOrThrow<string>('JWT_SECRET'),
                global:true
            } 
        },
        inject:[ConfigService]
    })],
    controllers:[AuthController],
    providers:[AuthService]
})
export class AuthModule{}