const express = require('express');
const { resetPassword, resetLinkSend } = require('../controllers/forgotPassword');

const router = express.Router();

router.post('/resetPassword', resetPassword)
router.post('/recoveryEmail', resetLinkSend)

module.exports = router