const express = require('express');
const { getAllDocuments } = require('../controllers/document');
const router = express.Router();


router.get('/getDocuments', getAllDocuments);

module.exports = router;