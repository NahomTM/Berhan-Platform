-- DropForeignKey
ALTER TABLE "InstructorUploads" DROP CONSTRAINT "InstructorUploads_userId_fkey";

-- AddForeignKey
ALTER TABLE "InstructorUploads" ADD CONSTRAINT "InstructorUploads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
