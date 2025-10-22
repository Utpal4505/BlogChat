-- CreateTable
CREATE TABLE "public"."BookmarkPost" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookmarkPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BookmarkPost_postId_idx" ON "public"."BookmarkPost"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "BookmarkPost_userId_postId_key" ON "public"."BookmarkPost"("userId", "postId");

-- AddForeignKey
ALTER TABLE "public"."BugReport" ADD CONSTRAINT "BugReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookmarkPost" ADD CONSTRAINT "BookmarkPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookmarkPost" ADD CONSTRAINT "BookmarkPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
