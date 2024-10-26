-- AlterTable
ALTER TABLE "User" ALTER COLUMN "profile" DROP NOT NULL,
ALTER COLUMN "profile" SET DEFAULT 'default';
