-- AlterTable
ALTER TABLE "ListeningPreferences" ADD COLUMN     "country" TEXT NOT NULL DEFAULT 'any',
ALTER COLUMN "topics" SET DEFAULT ARRAY['any']::TEXT[];
