-- CreateEnum
CREATE TYPE "public"."PostTagStatus" AS ENUM ('PENDING', 'READY', 'FAILED');

-- AlterTable
ALTER TABLE "public"."Post" ADD COLUMN     "postTagStatus" "public"."PostTagStatus" NOT NULL DEFAULT 'PENDING';
