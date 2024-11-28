/*
  Warnings:

  - You are about to drop the column `timezone` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `location` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(200)` to `VarChar(100)`.
  - You are about to drop the `FailedMessage` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FailedMessage" DROP CONSTRAINT "FailedMessage_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "timezone",
ADD COLUMN     "lastBirthdaySent" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "firstName" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "lastName" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "location" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255);

-- DropTable
DROP TABLE "FailedMessage";
