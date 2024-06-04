const express = require('express');
const { getAllUsers } = require('../controllers/user');

const router = express.Router();

router.get('/getAll', getAllUsers)

module.exports = router