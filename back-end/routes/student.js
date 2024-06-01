const express = require('express');
const router = express.Router();
const {getAllClassesWithRelatedData, createStudent, updateStudent, deleteStudent, fetchAllStudents, studentSignIn} = require('../controllers/student');
const { fetchQuestionsWithExamCode } = require('../controllers/exam');

// Route to get all classes with related data
router.get('/getClass', getAllClassesWithRelatedData);
router.post('/addStudent', createStudent);
router.put('/updateStudent/:id', updateStudent);
router.delete('/deleteStudent/:id', deleteStudent)
router.get('/getAllStudent', fetchAllStudents)
router.post('/getanExam', fetchQuestionsWithExamCode)
router.post('/signIn', studentSignIn)

module.exports = router;
