/*
  Warnings:

  - You are about to drop the column `isPublished` on the `Post` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."Visibility" AS ENUM ('PRIVATE', 'PUBLIC');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('DRAFT', 'PUBLISHED');

-- AlterTable
ALTER TABLE "public"."Post" DROP COLUMN "isPublished",
ADD COLUMN     "status" "public"."Status" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "visibility" "public"."Visibility" NOT NULL DEFAULT 'PUBLIC';

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "visibility" "public"."Visibility" NOT NULL DEFAULT 'PUBLIC';

-- CreateIndex
CREATE INDEX "Post_title_idx" ON "public"."Post"("title");

-- CreateIndex
CREATE INDEX "Tag_name_idx" ON "public"."Tag"("name");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "public"."User"("username");
