/*
  Warnings:

  - You are about to drop the column `average` on the `Quiz` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "average",
ADD COLUMN     "avgRating" DECIMAL(10,2),
ADD COLUMN     "avgScore" DECIMAL(10,2);
