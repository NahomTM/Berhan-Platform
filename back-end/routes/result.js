const express = require('express');
const { addResult, getResultsByExamId, deleteResult, updateResult, publishResult, fetchedPublished } = require('../controllers/result');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

router.post('/addResult', authenticateToken, addResult)
router.post('/getResult', getResultsByExamId)
router.delete('/deleteResult/:id', deleteResult);
router.put('/updateResult/:id', updateResult);
router.put('/publishResult/:id', publishResult)
router.post('/getPublished', authenticateToken, fetchedPublished)

module.exports = router