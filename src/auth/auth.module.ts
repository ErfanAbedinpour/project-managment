import {Module} from '@nestjs/common'
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { UtilModule } from 'src/util/util.module';
import { JwtModule} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config'


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