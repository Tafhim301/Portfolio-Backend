/*
  Warnings:

  - The `role` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ROlE" AS ENUM ('ADMIN');

-- AlterTable
ALTER TABLE "user" DROP COLUMN "role",
ADD COLUMN     "role" "ROlE" NOT NULL DEFAULT 'ADMIN';

-- DropEnum
DROP TYPE "public"."role";
