/*
  Warnings:

  - A unique constraint covering the columns `[roomId]` on the table `Call` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roomId` to the `Call` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Call" ADD COLUMN     "loginTime" INTEGER,
ADD COLUMN     "logoutTime" INTEGER,
ADD COLUMN     "roomId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Call_roomId_key" ON "Call"("roomId");
