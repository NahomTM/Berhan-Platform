// questionRoutes.js

const express = require('express');
const { addQuestion, editQuestions } = require('../controllers/question');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();


router.post('/addQuestion', authenticateToken, addQuestion);
router.put('/updateExam/:examId', editQuestions)

module.exports = router;
