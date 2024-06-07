const express = require('express');
const { addResult, getResultsByExamId, deleteResult, updateResult } = require('../controllers/result');
const router = express.Router();

router.post('/addResult', addResult)
router.post('/getResult', getResultsByExamId)
router.delete('/deleteResult/:id', deleteResult);
router.put('/updateResult/:id', updateResult);

module.exports = router