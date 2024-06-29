-- CreateTable
CREATE TABLE "ListeningPreferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topic" TEXT NOT NULL DEFAULT 'any',
    "gender" TEXT NOT NULL DEFAULT 'any',
    "language" TEXT NOT NULL DEFAULT 'any',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListeningPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ListeningPreferences_userId_key" ON "ListeningPreferences"("userId");

-- AddForeignKey
ALTER TABLE "ListeningPreferences" ADD CONSTRAINT "ListeningPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
