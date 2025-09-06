-- CreateEnum
CREATE TYPE "public"."RegistrationStatus" AS ENUM ('PENDING', 'COMPLETED');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "registration_status" "public"."RegistrationStatus" NOT NULL DEFAULT 'PENDING';
