/*
  Warnings:

  - You are about to drop the column `staus` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "staus",
ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'ACTIVE';
