import {Module} from '@nestjs/common'
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { UtilModule } from '../util/util.module';
import {  UserTokenModule} from '../userToken/userToken.module';


@Module({
    imports:[UserModule,UtilModule,UserTokenModule],
    controllers:[AuthController],
    providers:[AuthService]
})
export class AuthModule{}