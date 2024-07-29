/*
  Warnings:

  - You are about to drop the column `receiverId` on the `Call` table. All the data in the column will be lost.
  - Added the required column `callId` to the `Call` table without a default value. This is not possible if the table is not empty.
  - Added the required column `calleeId` to the `Call` table without a default value. This is not possible if the table is not empty.
  - Made the column `callerId` on table `Call` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Call" DROP CONSTRAINT "Call_receiverId_fkey";

-- AlterTable
ALTER TABLE "Call" DROP COLUMN "receiverId",
ADD COLUMN     "acceptTime" INTEGER,
ADD COLUMN     "appId" TEXT,
ADD COLUMN     "callId" TEXT NOT NULL,
ADD COLUMN     "calleeId" TEXT NOT NULL,
ADD COLUMN     "cancelTime" INTEGER,
ADD COLUMN     "completeTime" INTEGER,
ADD COLUMN     "createTime" INTEGER,
ADD COLUMN     "endTime" INTEGER,
ADD COLUMN     "metaData" JSONB,
ADD COLUMN     "reason" TEXT,
ADD COLUMN     "rejectTime" INTEGER,
ADD COLUMN     "status" TEXT,
ADD COLUMN     "timeout" INTEGER,
ADD COLUMN     "timeoutTime" INTEGER,
ALTER COLUMN "callerId" SET NOT NULL,
ALTER COLUMN "duration" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_calleeId_fkey" FOREIGN KEY ("calleeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
