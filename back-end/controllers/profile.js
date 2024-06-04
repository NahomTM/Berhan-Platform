// backend/controllers/profileController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

// Fetch user profile
const getUserProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profilePicPath = path.join(__dirname, '../', user.profilePic);
    const profilePic = fs.readFileSync(profilePicPath, { encoding: 'base64' });

    const userData = {
      ...user,
      profilePic: `data:image/svg+xml;base64,${profilePic}`,
    };

    console.log(userData);

    res.json(userData);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  const userId = req.user.id;
  const { firstName, middleName, lastName, email, dateOfBirth, phoneNumber, address } = req.body;

  // Validate input data
  // You can use a validation library like Joi or validate manually here

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        firstName,
        middleName,
        lastName,
        email,
        dateOfBirth: new Date(dateOfBirth),
        phoneNumber,
        address,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
