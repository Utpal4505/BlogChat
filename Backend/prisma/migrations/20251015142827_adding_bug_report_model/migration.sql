-- CreateEnum
CREATE TYPE "public"."UserType" AS ENUM ('VERIFIED', 'UNVERIFIED');

-- CreateEnum
CREATE TYPE "public"."BugStatus" AS ENUM ('OPEN', 'RESOLVED', 'IGNORED');

-- CreateTable
CREATE TABLE "public"."BugReport" (
    "id" SERIAL NOT NULL,
    "bugType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "customPage" TEXT,
    "mood" TEXT,
    "userType" "public"."UserType" NOT NULL,
    "userId" INTEGER,
    "attachments" JSONB,
    "metadata" JSONB NOT NULL,
    "status" "public"."BugStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BugReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BugReport_id_bugType_status_idx" ON "public"."BugReport"("id", "bugType", "status");
