/*
  Warnings:

  - Added the required column `consoleErrors` to the `BugReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."BugReport" ADD COLUMN     "consoleErrors" JSONB NOT NULL;
