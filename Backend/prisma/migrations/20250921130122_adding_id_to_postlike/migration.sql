/*
  Warnings:

  - The primary key for the `Follow` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PostLike` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[followerId,followeeId]` on the table `Follow` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,postId]` on the table `PostLike` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Follow" DROP CONSTRAINT "Follow_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Follow_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."PostLike" DROP CONSTRAINT "PostLike_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "PostLike_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Follow_followerId_followeeId_key" ON "public"."Follow"("followerId", "followeeId");

-- CreateIndex
CREATE UNIQUE INDEX "PostLike_userId_postId_key" ON "public"."PostLike"("userId", "postId");
