/*
  Warnings:

  - Made the column `views` on table `blogs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "blogs" ALTER COLUMN "views" SET NOT NULL;

-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "demoImages" SET DEFAULT ARRAY[]::TEXT[];
