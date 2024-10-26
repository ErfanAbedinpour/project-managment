/*
  Warnings:

  - You are about to drop the `ProjectContribute` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `profile` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProjectContribute" DROP CONSTRAINT "ProjectContribute_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectContribute" DROP CONSTRAINT "ProjectContribute_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profile" VARCHAR(200) NOT NULL;

-- DropTable
DROP TABLE "ProjectContribute";

-- CreateTable
CREATE TABLE "UserProjects" (
    "projectId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserProjects_pkey" PRIMARY KEY ("projectId","userId")
);

-- AddForeignKey
ALTER TABLE "UserProjects" ADD CONSTRAINT "UserProjects_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProjects" ADD CONSTRAINT "UserProjects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
