// backend/controllers/profileController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");

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
      return res.status(404).json({ message: "User not found" });
    }

    // Read the profile picture file asynchronously
    fs.readFile(user.profilePic, async (error, data) => {
      if (error) {
        console.error("Error reading profile picture:", error);
        return res.status(500).json({ message: "Error reading profile picture" });
      }

      // Get the file extension to determine the image type
      const extension = path.extname(user.profilePic).slice(1); // Remove the leading dot

      // Encode the image data to base64
      const base64Image = Buffer.from(data).toString("base64");

      // Construct the data URL with the appropriate MIME type
      const profilePicDataURL = `data:image/${extension};base64,${base64Image}`;

      // Include the encoded image data in the user data
      const userData = {
        ...user,
        profilePic: profilePicDataURL,
      };

      res.json(userData);
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Update user profile
const updateUserProfile = async (req, res) => {
  const userId = req.user.id;
  const { firstName, middleName, lastName, dateOfBirth, email, phoneNumber, address } = req.body;

  try {
    // Check if a file is uploaded
    let profilePic = null;
    if (req.file) {
      const fileName = req.file.filename;
      profilePic = `uploads/${fileName}`;

      // Find the current user's profile to delete the old profile picture
      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (currentUser.profilePic) {
        const oldPicPath = path.join(__dirname, '../', currentUser.profilePic);
        if (fs.existsSync(oldPicPath)) {
          fs.unlinkSync(oldPicPath);
        }
      }
    }

    const updateData = {
      firstName,
      middleName,
      lastName,
      dateOfBirth: new Date(dateOfBirth),
      email,
      phoneNumber,
      address,
      ...(profilePic && { profilePic }), // Conditionally add profilePic if it exists
    };

    // Update the user's profile in the database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
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
