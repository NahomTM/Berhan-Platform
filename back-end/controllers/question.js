const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function addQuestion(req, res) {
  try {
    const formData = req.body;
    const { questions, ...rest } = formData;
    const userId = req.user.id;
    const numberOfQuestions = parseInt(rest.numberOfQuestions);
    const courseId = parseInt(rest.course);

    const { examCode, examName, duration, examDate } = rest;

    // Create the exam in the database
    const exam = await prisma.exam.create({
      data: {
        examCode,
        examName,
        numberOfQuestions,
        duration,
        examDate: new Date(examDate),
        userId: userId,
        courseId: courseId,
      },
    });

    // Loop through each question in the form data and save it to the database
    for (const questionData of questions) {
      const { question, choices, correctAnswer } = questionData;

      // Create the question in the database
      await prisma.question.create({
        data: {
          examId: exam.id,
          question,
          choiceA: choices[0],
          choiceB: choices[1],
          choiceC: choices[2],
          choiceD: choices[3],
          correctAnswer,
        },
      });
    }

    res.status(201).json({ message: "Form data saved successfully" });
  } catch (error) {
    console.error("Error saving form data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const editQuestions = async (req, res) => {
  try {
    const examId = parseInt(req.params.examId, 10);
    const formData = req.body;
    const { questions, ...rest } = formData;
    const numberOfQuestions = parseInt(rest.numberOfQuestions);
    const courseId = parseInt(rest.course);

    const { examCode, examName, duration, examDate } = rest;
    const parseDate = (dateString) => {
      // Split the date string into month, day, and year components
      const [month, day, year] = dateString.split("/");
      // Return a new Date object with the components
      return new Date(`${year}-${month}-${day}`);
    };

    // Create the exam in the database
    const exam = await prisma.exam.update({
      where: {
        id: examId,
      },
      data: {
        examCode,
        examName,
        numberOfQuestions,
        duration,
        examDate: parseDate(examDate),
      },
    });

    // Loop through each question in the form data and save it to the database
    // Loop through each question in the form data and save it to the database
    for (const questionData of questions) {
      const { questionId, question, choices, correctAnswer } = questionData;

      // Create the question in the database
      await prisma.question.update({
        where: {
          id: questionId, // Provide the question ID
          examId: examId, // Filter by examId
        },
        data: {
          question,
          choiceA: choices[0],
          choiceB: choices[1],
          choiceC: choices[2],
          choiceD: choices[3],
          correctAnswer,
        },
      });
    }

    res.json({msg: "success"})
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addQuestion,
  editQuestions,
};
