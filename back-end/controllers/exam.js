const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { verifyAccessToken } = require("../utils/authUtils"); // JWT verification utility

const getCourses = async (req, res) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({ error: "No authorization header provided" });
  }

  const token = authorizationHeader.replace("Bearer ", "");
  const { valid, decoded, error } = verifyAccessToken(token);

  if (!valid) {
    return res
      .status(401)
      .json({ error: "Invalid access token", detail: error.message });
  }

  const userId = decoded.id; // Get user ID from the token

  try {
    const classes = await prisma.class.findMany({
      where: { userId },
      select: {
        course: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const courses = classes.map((cls) => cls.course);

    return res.status(200).json({ courses });
  } catch (err) {
    return res.status(500).json({ error: "Server error", detail: err.message });
  }
};
const getAllExams = async (req, res) => {
  try {
    const userId = req.user.id
    const exams = await prisma.exam.findMany({
      where: {
        userId: userId,
      },
    });
    res.status(200).json(exams);
  } catch (error) {
    console.error("Error fetching exams:", error);
    res.status(500).json({ error: "Failed to fetch exams" });
  }
};

const fetchExams = async (req, res) => {
  const userId = req.user.id;
  console.log("user id: ", userId);

  try {
    // Fetch exams for the user
    const exams = await prisma.exam.findMany({
      where: {
        userId: userId,
      },
      include: {
        course: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    // Format exams data
    const formattedExams = await Promise.all(
      exams.map(async (exam) => {
        // Fetch questions for each exam
        const questions = await prisma.question.findMany({
          where: { examId: exam.id },
        });

        // Format questions data
        const formattedQuestions = questions.map((question) => ({
          questionId: question.id,
          question: question.question,
          choices: [
            question.choiceA,
            question.choiceB,
            question.choiceC,
            question.choiceD,
          ],
          correctAnswer: question.correctAnswer,
        }));

        return {
          examId: exam.id,
          course: exam.course.name,
          examName: exam.examName,
          numberOfQuestions: exam.numberOfQuestions,
          examCode: exam.examCode,
          examDate: exam.examDate, // Assuming you have examDate field in the Exam model
          duration: exam.duration,
          questions: formattedQuestions,
        };
      })
    );

    console.log(formattedExams);
    res.json(formattedExams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateExam = async (req, res) => {
  const { id } = req.params;
  const { courseId, examCode, examName, duration, numberOfQuestions, userId } =
    req.body;

  try {
    const updatedExam = await Exam.findByIdAndUpdate(
      id,
      {
        courseId,
        examCode,
        examName,
        duration,
        numberOfQuestions,
        userId,
      },
      { new: true }
    );

    res.json(updatedExam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const fetchQuestionsWithExamCode = async (req, res) => {
  const examCode = req.body.code;

  try {
    // Fetch the exam with the provided exam code
    const exam = await prisma.exam.findUnique({
      where: {
        examCode,
      },
      include: {
        course: true, // Ensure the course relation is included
      },
    });

    // Check if the exam exists
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    // Fetch questions for the exam
    const questions = await prisma.question.findMany({
      where: { examId: exam.id },
    });

    // Map to convert answer letters to numbers
    const answerMap = {
      A: "1",
      B: "2",
      C: "3",
      D: "4",
    };

    // Format questions data
    const formattedQuestions = questions.map((question) => ({
      questionId: question.id,
      question: question.question,
      choicea: question.choiceA,
      choiceb: question.choiceB,
      choicec: question.choiceC,
      choiced: question.choiceD,
      answers: answerMap[question.correctAnswer], // Convert letter to number
    }));

    const formattedExam = {
      examId: exam.id,
      course: exam.course.name,
      examName: exam.examName,
      numberOfQuestions: exam.numberOfQuestions,
      examCode: exam.examCode,
      examDate: exam.examDate, // Assuming you have examDate field in the Exam model
      duration: exam.duration,
      questions: formattedQuestions,
    };

    console.log(formattedExam);
    res.json(formattedExam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



// Controller function to delete an exam
const deleteExam = async (req, res) => {
  const { id } = req.params;

  try {
    await Exam.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getCourses, fetchExams, updateExam, deleteExam, fetchQuestionsWithExamCode, getAllExams };
