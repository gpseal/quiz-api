/*
  Warnings:

  - You are about to drop the column `quizId` on the `Rating` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_quizId_fkey";

-- AlterTable
ALTER TABLE "Rating" DROP COLUMN "quizId",
ADD COLUMN     "quizID" INTEGER;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_quizID_fkey" FOREIGN KEY ("quizID") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;
