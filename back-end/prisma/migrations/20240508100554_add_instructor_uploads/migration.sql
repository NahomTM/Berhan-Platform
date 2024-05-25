/*
  Warnings:

  - Added the required column `filePath` to the `InstructorUploads` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InstructorUploads" ADD COLUMN     "filePath" TEXT NOT NULL;
