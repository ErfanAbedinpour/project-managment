import { Prisma, PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import { join } from 'path';
import { IEnvironmentVariables } from '../src/type';
import { BcryptHashing } from '../src/auth/hash/bcrypt.service';

config({ path: join(process.cwd(), '.env.dev') });
const prisma = new PrismaClient();
declare global {
  namespace Nodejs {
    interface ProcessEnv extends IEnvironmentVariables { }
  }
}



async function seed() {
  const util = new BcryptHashing();

  const hashPass = await util.hash(process.env.ADMIN_PASSWORD);

  const user: Prisma.UserCreateInput = {
    username: process.env.ADMIN_USERNAME,
    email: process.env.ADMIN_EMAIL,
    display_name: 'admin',
    password: hashPass,
    role: "ADMIN"
  };

  await prisma.user.create({ data: user });
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
