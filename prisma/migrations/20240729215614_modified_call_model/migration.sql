/*
  Warnings:

  - You are about to drop the column `completeTime` on the `Call` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[callId]` on the table `Call` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Call" DROP COLUMN "completeTime";

-- CreateIndex
CREATE UNIQUE INDEX "Call_callId_key" ON "Call"("callId");
