const express = require("express");
const {getCourses, fetchExams, updateExam, deleteExam, getAllExams} = require("../controllers/exam");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

// Endpoint to fetch courses for a user based on the token
router.get("/getCourse", getCourses);
router.get('/getExam', authenticateToken, fetchExams); // Route to fetch exams
router.put('/updateExam/:id', updateExam); // Route to update an exam
router.delete('/deleteExam/:id', deleteExam); // Route to delete an exam
router.get('/getLineExam', authenticateToken, getAllExams);

module.exports = router;
