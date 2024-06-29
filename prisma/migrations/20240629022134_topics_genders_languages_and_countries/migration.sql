/*
  Warnings:

  - You are about to drop the column `country` on the `ListeningPreferences` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `ListeningPreferences` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `ListeningPreferences` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ListeningPreferences" DROP COLUMN "country",
DROP COLUMN "gender",
DROP COLUMN "language",
ADD COLUMN     "countries" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "genders" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "topics" SET DEFAULT ARRAY[]::TEXT[];
