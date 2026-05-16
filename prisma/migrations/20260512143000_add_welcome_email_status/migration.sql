-- AlterTable
ALTER TABLE "Session" ADD COLUMN "welcomeEmailStatus" TEXT;
ALTER TABLE "Session" ADD COLUMN "welcomeEmailProviderId" TEXT;
ALTER TABLE "Session" ADD COLUMN "welcomeEmailError" TEXT;
ALTER TABLE "Session" ADD COLUMN "welcomeEmailAttemptedAt" DATETIME;
