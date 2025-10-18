/*
  Warnings:

  - The `screenshotUrl` column on the `Feedback` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Feedback" DROP COLUMN "screenshotUrl",
ADD COLUMN     "screenshotUrl" JSONB;
