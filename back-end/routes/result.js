const express = require('express');
const { addResult, getResultsByExamId } = require('../controllers/result');
const router = express.Router();

router.post('/addResult', addResult)
router.post('/getResult', getResultsByExamId)

module.exports = router