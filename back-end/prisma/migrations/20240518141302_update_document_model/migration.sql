/*
  Warnings:

  - Added the required column `docId` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "docId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_docId_fkey" FOREIGN KEY ("docId") REFERENCES "InstructorUploads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
