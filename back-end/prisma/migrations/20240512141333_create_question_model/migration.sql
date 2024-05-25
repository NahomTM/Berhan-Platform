-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "course" TEXT NOT NULL,
    "examCode" TEXT NOT NULL,
    "examName" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "numberOfQuestions" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "choiceA" TEXT NOT NULL,
    "choiceB" TEXT NOT NULL,
    "choiceC" TEXT NOT NULL,
    "choiceD" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
