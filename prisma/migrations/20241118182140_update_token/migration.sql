/*
  Warnings:

  - You are about to drop the column `expireAt` on the `UserToken` table. All the data in the column will be lost.
  - You are about to drop the column `isRevoke` on the `UserToken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserToken" DROP COLUMN "expireAt",
DROP COLUMN "isRevoke";
