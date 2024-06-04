-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_docId_fkey";

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_docId_fkey" FOREIGN KEY ("docId") REFERENCES "InstructorUploads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
