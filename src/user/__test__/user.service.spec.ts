import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { UserServices } from '../user.service';
import { Prisma, PrismaClient, User } from '@prisma/client';
import { PrismaModule } from '../../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { CreateUserDTO } from 'src/auth/dtos/auth.dto';
import { AuthService } from 'src/auth/auth.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { UtilModule } from '../../util/util.module';
import { CacheModule } from '@nestjs/cache-manager';
import { UserTokenService } from '../../userToken/userToken.service';
import { UserTokenModule } from '../../userToken/userToken.module';

describe('user Service', () => {
  let userService: UserServices;

  const user: CreateUserDTO = {
    username: 'user1',
    email: 'email1@gmail.com',
    password: '12341234',
    display_name: 'nice',
  };
  const user2 = {
    id: 2,
    username: 'user2',
    email: 'email2@gmail.com',
    password: '12341234',
    display_name: 'nice',
  };
  const user3 = {
    id: 3,
    username: 'user3',
    email: 'email3@gmail.com',
    password: '12341234',
    display_name: 'nice',
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: join(process.cwd(), `.env.test`),
          isGlobal: true,
        }),
        PrismaModule,
        MailerModule.forRoot({
          transport: {
            host: 'gmail',
            auth: {},
          },
        }),
        UtilModule,
        CacheModule.register({ isGlobal: true }),
        UserTokenModule,
      ],
      providers: [UserServices],
    }).compile();

    userService = module.get<UserServices>(UserServices);
    await Promise.all([
      userService.createUser(user),
      userService.createUser(user2),
      userService.createUser(user3),
    ]);
  });

  afterAll(async () => {
    const client = new PrismaClient();
    await client.user.deleteMany();
    await client.$disconnect();
  });

  it('should be created user', async () => {
    const fakeUser: CreateUserDTO = {
      username: 'this is new username',
      email: 'faleMail@gmail.com',
      display_name: 'nicee',
      password: '12341324',
    };

    const createdUser = await userService.createUser(fakeUser);

    expect(createdUser.username).toEqual(fakeUser.username);
    expect(createdUser.email).toEqual(fakeUser.email);
    expect(createdUser.role).toEqual('USER');
  });

  it('should be find user ', async () => {
    const targetUser = await userService.user({ username: user.username });

    expect(targetUser.email).toEqual(user.email);
    expect(targetUser.username).toEqual(user.username);
  });

  it('should be returned multiple user', async () => {
    const users = await userService.users({ where: { display_name: 'nice' } });

    expect(users.length).toEqual(3);

    for (const u of users) {
      expect(u.display_name).toEqual('nice');
    }
  });

  it('should be change user2 username to new usename', async () => {
    const newUser = await userService.updateUser({
      id: user2.id,
      data: { username: 'newUser2' },
    });
    //change user2 username to new username
    user2.username = newUser.username;
    // tests
    expect(newUser.username).toEqual('newUser2');
    expect(newUser.email).toEqual(user2.email);
  });

  it('should be deleted user2', async () => {
    await userService.deleteUser({ username: user2.username });

    const user = await userService.user({
      username: user2.username,
    });
    // expect user2 to be removed form DB
    expect(user).toBeNull();
  });
});
