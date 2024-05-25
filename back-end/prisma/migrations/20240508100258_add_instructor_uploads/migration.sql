-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_userId_fkey";

-- CreateTable
CREATE TABLE "InstructorUploads" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "InstructorUploads_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstructorUploads" ADD CONSTRAINT "InstructorUploads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
