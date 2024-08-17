/*
  Warnings:

  - You are about to drop the `Preference` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Preference" DROP CONSTRAINT "Preference_userId_fkey";

-- DropTable
DROP TABLE "Preference";
