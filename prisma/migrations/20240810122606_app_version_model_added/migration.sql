-- CreateTable
CREATE TABLE "AppVersion" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "force" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppVersion_pkey" PRIMARY KEY ("id")
);
