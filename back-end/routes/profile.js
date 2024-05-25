const express = require("express");
const { getUserProfile, updateUserProfile } = require("../controllers/profile");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

router.get('/getProfile', authenticateToken, getUserProfile)
router.put('/updateProfile', authenticateToken, updateUserProfile)

module.exports = router