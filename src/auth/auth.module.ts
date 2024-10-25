import {Module} from '@nestjs/common'
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { UtilModule } from 'src/util/util.module';


@Module({
    imports:[UserModule,UtilModule],
    controllers:[AuthController],
    providers:[AuthService]
})
export class AuthModule{}