import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { UtilModule } from '../util/util.module';
import { BcryptHashing } from './hash/bcrypt.service';
import { HashingService } from './hash/hash.service';
import { PrismaModule } from '../prisma/prisma.module';


@Module({
    imports: [UserModule, UtilModule, PrismaModule],
    controllers: [AuthController],
    providers: [AuthService, {
        provide: HashingService,
        useClass: BcryptHashing
    }]
})
export class AuthModule { }