/*
  Warnings:

  - You are about to drop the column `questions` on the `Quiz` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "questions";

-- CreateTable
CREATE TABLE "Questions" (
    "id" SERIAL NOT NULL,
    "quizid" INTEGER NOT NULL,
    "questions" JSONB,

    CONSTRAINT "Questions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Questions" ADD CONSTRAINT "Questions_quizid_fkey" FOREIGN KEY ("quizid") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
