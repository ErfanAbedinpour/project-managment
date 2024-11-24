import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { UtilModule } from '../util/util.module';
import { BcryptHashing } from './hash/bcrypt.service';
import { HashingService } from './hash/hash.service';
import { PrismaModule } from '../prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGurad } from './gurad/auth.guard';
import { AccessTokenGurad } from './gurad/accessToken.guard';


@Module({
    imports: [UserModule, UtilModule, PrismaModule],
    controllers: [AuthController],
    providers: [AuthService,
        {
            provide: HashingService,
            useClass: BcryptHashing
        },
        {
            provide: APP_GUARD,
            useClass: AuthGurad
        },
        AccessTokenGurad
    ]
})
export class AuthModule { }