-- CreateEnum
CREATE TYPE "public"."BugReportQueueStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "public"."BugReport" ADD COLUMN     "queueStatus" "public"."BugReportQueueStatus" NOT NULL DEFAULT 'PENDING';
