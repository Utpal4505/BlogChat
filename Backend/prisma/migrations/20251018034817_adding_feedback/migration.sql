-- CreateTable
CREATE TABLE "public"."Feedback" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "experienceMood" TEXT NOT NULL,
    "liked" TEXT,
    "issues" TEXT,
    "page" TEXT NOT NULL,
    "improvement" TEXT,
    "hasBug" BOOLEAN NOT NULL DEFAULT false,
    "bugDescription" TEXT,
    "screenshotUrl" TEXT,
    "recommendScore" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Feedback_page_idx" ON "public"."Feedback"("page");

-- CreateIndex
CREATE INDEX "Feedback_hasBug_idx" ON "public"."Feedback"("hasBug");

-- AddForeignKey
ALTER TABLE "public"."Feedback" ADD CONSTRAINT "Feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
