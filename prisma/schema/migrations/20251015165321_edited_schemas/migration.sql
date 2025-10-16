/*
  Warnings:

  - The `isFeatured` column on the `blogs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `authorId` to the `blogs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "blogs" ADD COLUMN     "authorId" TEXT NOT NULL,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "isFeatured",
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
