const express = require('express');
const { getRoomsByUserId } = require('../controllers/room');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

router.get('/getSpecStud', authenticateToken, getRoomsByUserId);

module.exports = router;