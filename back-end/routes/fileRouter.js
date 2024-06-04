const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadFile, getFile, getUploads, textToSpeech, deleteUpload, uploadFileAndTextToSpeech, getAudio } = require('../controllers/fileController');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

// Configure Multer to store files on disk with a unique name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Route for file uploads
router.post('/upload', authenticateToken, upload.single('file'), uploadFileAndTextToSpeech);

// Route for getting file information by ID
router.get('/file/:id', getFile);
router.get('/getUploads', authenticateToken, getUploads)
router.delete('/deleteUpload/:id', deleteUpload)
router.get('/getAudio/:id', getAudio)

module.exports = router;
