/*
  Warnings:

  - Added the required column `examDate` to the `Exam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "examDate" TIMESTAMP(3) NOT NULL;
