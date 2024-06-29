/*
  Warnings:

  - You are about to drop the column `topic` on the `ListeningPreferences` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ListeningPreferences" DROP COLUMN "topic",
ADD COLUMN     "topics" TEXT[] DEFAULT ARRAY[]::TEXT[];
