/*
  Warnings:

  - You are about to drop the `UserProjects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserProjects" DROP CONSTRAINT "UserProjects_projectId_fkey";

-- DropForeignKey
ALTER TABLE "UserProjects" DROP CONSTRAINT "UserProjects_userId_fkey";

-- DropIndex
DROP INDEX "Project_ownerId_key";

-- DropTable
DROP TABLE "UserProjects";

-- CreateTable
CREATE TABLE "ProjectContributer" (
    "projectId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectContributer_pkey" PRIMARY KEY ("projectId","userId")
);

-- AddForeignKey
ALTER TABLE "ProjectContributer" ADD CONSTRAINT "ProjectContributer_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectContributer" ADD CONSTRAINT "ProjectContributer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
