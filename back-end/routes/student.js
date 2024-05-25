const express = require('express');
const router = express.Router();
const {getAllClassesWithRelatedData, createStudent, updateStudent, deleteStudent, fetchAllStudents} = require('../controllers/student');

// Route to get all classes with related data
router.get('/getClass', getAllClassesWithRelatedData);
router.post('/addStudent', createStudent);
router.put('/updateStudent/:id', updateStudent);
router.delete('/deleteStudent/:id', deleteStudent)
router.get('/getAllStudent', fetchAllStudents)

module.exports = router;
