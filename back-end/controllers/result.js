const PrismaClient = require('@prisma/client').PrismaClient;
const prisma = new PrismaClient();

const addResult = async (req, res) => {
    let { result, examId } = req.body;

    console.log("result: ", result);
    console.log("examId: ", examId);
  
    // Convert inputs to integers
    result = parseInt(result, 10);
    studentId = 3
    const examCode = examId.toString();
  
    // Validate the converted inputs
    if (isNaN(result) || isNaN(studentId) || isNaN(examId)) {
      return res.status(400).json({ error: 'Invalid input data' });
    }
  
    try {
      // Create a new result record

      const exam = await prisma.exam.findUnique({
        where:{
          examCode: examCode
        }
      })
      const newResult = await prisma.result.create({
        data: {
          result,
          studentId,
          examId: exam.id,
        },
      });
  
      // Respond with the created result
      res.status(201).json({
        message: 'Result added successfully',
        result: newResult,
      });
    } catch (error) {
      console.error('Error adding result:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  const getResultsByExamId = async (req, res) => {
    const { examId } = req.body;
    console.log("examId: ", examId);
  
    try {
      const results = await prisma.result.findMany({
        where: {
          examId: parseInt(examId),
        },
        include: {
          exam: {
            select: {
              examName: true,
            },
          },
          student: {
            select: {
              id: true,
              firstName: true,
              middleName: true,
              lastName: true,
            },
          },
        },
      });
  
      if (!results || results.length === 0) {
        return res.status(200).json({ error: 'No results found for the provided exam ID', msg: 'failed' });
      }
  
      const formattedResults = results.map(result => ({
        studentId: result.student.id,
        examId: result.examId,
        resultId: result.id,
        examName: result.exam.examName,
        result: result.result,
        studentName: `${result.student.firstName} ${result.student.middleName || ''} ${result.student.lastName}`,
      }));
  
      return res.status(200).json(formattedResults);
    } catch (error) {
      console.error('Error retrieving results:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  const updateResult = async (req, res) => {
    const { id } = req.params;
    const { result } = req.body;
  
    try {
      const updatedResult = await prisma.result.update({
        where: { id: parseInt(id) },
        data: { result: parseInt(result) },
      });
      res.status(200).json(updatedResult);
    } catch (error) {
      console.error('Error updating result:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  const deleteResult = async (req, res) => {
    const { id } = req.params;
  
    try {
      await prisma.result.delete({
        where: { id: parseInt(id) },
      });
      res.status(200).json({ message: 'Result deleted successfully' });
    } catch (error) {
      console.error('Error deleting result:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

module.exports = {addResult, getResultsByExamId, deleteResult, updateResult}
  