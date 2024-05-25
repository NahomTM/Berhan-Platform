/*
  Warnings:

  - You are about to drop the column `courseId` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `examCode` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `examName` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfQuestions` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Question` table. All the data in the column will be lost.
  - Added the required column `examId` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_userId_fkey";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "courseId",
DROP COLUMN "duration",
DROP COLUMN "examCode",
DROP COLUMN "examName",
DROP COLUMN "numberOfQuestions",
DROP COLUMN "userId",
ADD COLUMN     "examId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Exam" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "examCode" TEXT NOT NULL,
    "examName" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "numberOfQuestions" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Exam_examCode_key" ON "Exam"("examCode");

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
