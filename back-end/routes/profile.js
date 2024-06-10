const express = require("express");
const { getUserProfile, updateUserProfile } = require("../controllers/profile");
const authenticateToken = require("../middleware/authenticateToken");
const multer = require('multer');
const path = require('path');

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

// Route for getting user profile
router.get('/getProfile', authenticateToken, getUserProfile);

// Route for updating user profile
router.put('/updateProfile', authenticateToken, upload.single('profilePicture'), updateUserProfile);

module.exports = router;
