/*
  Warnings:

  - You are about to drop the `RetryJobs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RetryJobs" DROP CONSTRAINT "RetryJobs_userId_fkey";

-- DropTable
DROP TABLE "RetryJobs";

-- CreateTable
CREATE TABLE "RetryJob" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "retryCount" INTEGER NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "lastAttempt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT NOT NULL,

    CONSTRAINT "RetryJob_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RetryJob" ADD CONSTRAINT "RetryJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
