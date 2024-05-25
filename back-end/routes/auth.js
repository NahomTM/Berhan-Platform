const express = require('express');
const { signIn } = require('../controllers/auth');
const { verifyRole } = require('../controllers/auth');

const router = express.Router();


router.post('/signIn', signIn);
router.post('/verify-role', verifyRole)

module.exports = router;
