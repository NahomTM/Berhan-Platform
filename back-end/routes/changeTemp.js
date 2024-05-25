const express = require('express');
const { verifyToken, getId, updateTemp } = require('../controllers/changeTemp');

const router = express.Router();

router.post('/verifyToken', verifyToken)
router.get('/user/:id', getId)
router.put('/user/:id', updateTemp)

module.exports = router