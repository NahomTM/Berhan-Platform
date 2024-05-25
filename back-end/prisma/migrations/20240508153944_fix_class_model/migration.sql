-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_userId_fkey";

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
