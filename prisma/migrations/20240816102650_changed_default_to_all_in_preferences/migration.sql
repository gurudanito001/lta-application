-- AlterTable
ALTER TABLE "Preference" ALTER COLUMN "topics" SET DEFAULT ARRAY['all']::TEXT[],
ALTER COLUMN "genders" SET DEFAULT ARRAY['all']::TEXT[],
ALTER COLUMN "languages" SET DEFAULT ARRAY['all']::TEXT[],
ALTER COLUMN "countries" SET DEFAULT ARRAY['all']::TEXT[];
