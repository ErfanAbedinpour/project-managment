import {Module} from '@nestjs/common'
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config'
import { UserModule } from '../user/user.module';
import { UtilModule } from '../util/util.module';


@Module({
    imports:[UserModule,UtilModule,JwtModule.registerAsync({
        useFactory:async (config:ConfigService)=> {
            return {
                secret:config.getOrThrow<string>('SECRET'),
                global:true
            } 
        },
        inject:[ConfigService]
    })],
    controllers:[AuthController],
    providers:[AuthService]
})
export class AuthModule{}