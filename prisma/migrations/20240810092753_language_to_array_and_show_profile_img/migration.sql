/*
  Warnings:

  - The `language` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "showProfileImg" BOOLEAN NOT NULL DEFAULT true,
DROP COLUMN "language",
ADD COLUMN     "language" TEXT[];
