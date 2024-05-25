// backend/controllers/profileController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fetch user profile
const getUserProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        firstName: true,
        middleName: true,
        lastName: true,
        email: true,
        dateOfBirth: true,
        phoneNumber: true,
        address: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
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
