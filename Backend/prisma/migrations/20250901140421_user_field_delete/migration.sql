/*
  Warnings:

  - You are about to drop the column `userId` on the `EmailVerification` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."EmailVerification" DROP CONSTRAINT "EmailVerification_userId_fkey";

-- DropIndex
DROP INDEX "public"."EmailVerification_userId_key";

-- AlterTable
ALTER TABLE "public"."EmailVerification" DROP COLUMN "userId";
