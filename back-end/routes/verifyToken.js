const express = require('express');
const {validateToken} = require('../controllers/verifyToken')

const router = express.Router();

router.post('/verify-token', validateToken)

module.exports = router;