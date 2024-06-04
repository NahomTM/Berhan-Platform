const PrismaClient = require('@prisma/client').PrismaClient;
const prisma = new PrismaClient();

const addResult = async (req, res) => {
    let { result, studentId, examId } = req.body;
  
    // Convert inputs to integers
    result = parseInt(result, 10);
    studentId = parseInt(studentId, 10);
    examId = parseInt(examId, 10);
  
    // Validate the converted inputs
    if (isNaN(result) || isNaN(studentId) || isNaN(examId)) {
      return res.status(400).json({ error: 'Invalid input data' });
    }
  
    try {
      // Create a new result record
      const newResult = await prisma.result.create({
        data: {
          result,
          studentId,
          examId,
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
              firstName: true,
              middleName: true,
              lastName: true,
            },
          },
        },
      });
  
      if (!results || results.length === 0) {
        return res.status(200).json({ error: 'No results found for the provided exam ID', msg:"failed" });
      }
  
      const formattedResults = results.map(result => ({
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

module.exports = {addResult, getResultsByExamId}
  