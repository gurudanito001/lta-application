/*
  Warnings:

  - Made the column `rating` on table `Rating` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Rating" ALTER COLUMN "rating" SET NOT NULL;
