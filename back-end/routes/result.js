const express = require('express');
const { addResult } = require('../controllers/result');
const router = express.Router();

router.post('addResult', addResult)

module.exports = router