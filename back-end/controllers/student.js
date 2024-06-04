const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { createAccessToken } = require('../utils/authUtils');
const {hashPassword, verifyPassword} = require('../utils/passwordUtils')

const generateRandomUsername = (fName, lName) => {
  // Generate a random username
  const randomNum = Math.floor(Math.random() * 1000);
  return `${fName.toLowerCase()}${lName.toLowerCase()}${randomNum}`;
};

const generateQRCodeValue = async (formData) => {
  const fullName = `${formData.fName} ${formData.mName} ${formData.lName}`;
  const details = `${fullName}|${formData.gender}|${formData.dob}|${formData.email}|${formData.phone}|${formData.address}`;
  console.log(details);

  // Create a hash of the details
  const hashedQr = await hashPassword(details);
  return hashedQr
};
// Function to get all classes with related data
const getAllClassesWithRelatedData = async (req, res) => {
  try {
    const classes = await prisma.class.findMany({
      include: {
        course: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            firstName: true,
            middleName: true,
            lastName: true,
          },
        },
      },
    });
    res.json(classes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const createStudent = async (req, res) => {
  try {
    const {
        fName,
        mName,
        lName,
        gender,
        dob,
        role,
        phone,
        email,
        address,
        selectedCourses = [], // Default to empty array
      } = req.body;
    const randomUsername = generateRandomUsername(fName, lName);
    const formData = req.body;
    const qrCodeValue = await generateQRCodeValue(formData);
    // Create user in the User model
    const newUser = await prisma.user.create({
      data: {
        firstName: fName,
        middleName: mName,
        lastName: lName,
        gender,
        username: randomUsername,
        password: qrCodeValue,
        dateOfBirth: new Date(dob),
        role,
        email,
        phoneNumber: phone,
        address,
        profilePic: "uploads/defaultProfilePage.svg",
      },
    });
    const classes = await prisma.class.findMany({
        where: {
          name: {
            in: selectedCourses,
          },
        },
      });
      
      const classData = classes.map((cls) => ({
        name: `${fName} ${cls.name}`,
        classId: cls.id,
        userId: newUser.id,
      }));

      console.log(`Classes to Create: ${JSON.stringify(classData)}`); // Debug class data

      await prisma.room.createMany({
        data: classData
      });
      res.status(201).json({ message: "User created successfully"});
    
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

async function fetchAllStudents(req, res) {
  try {
    const employees = await prisma.user.findMany({
      where: {
        role: {
          in: ["student"]
        }
      }
    });
    res.status(200).json(employees); // Respond with the list of employees with roles "admin" or "instructor"
  } catch (error) {
    res.status(500).json({ error: `Error fetching student: ${error.message}` }); // Handle error
  }
}
async function deleteStudent(req, res) {
  const employeeId = parseInt(req.params.id, 10); // Extract employee ID from URL parameter
  try {
    await prisma.user.delete({
      where: { id: employeeId },
    });
    res.status(200).json({ message: "Student deleted successfully" }); // Respond with success message
  } catch (error) {
    res.status(500).json({ error: `Error deleting student: ${error.message}` }); // Handle error
  }
}

const updateStudent = async (req, res) => {
  const userId = parseInt(req.params.id);
  const {
    firstName,
    middleName,
    lastName,
    gender,
    dateOfBirth,
    role,
    phoneNumber,
    email,
    address
  } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        middleName,
        lastName,
        gender,
        dateOfBirth: new Date(dateOfBirth), // Assuming dateOfBirth is in proper format
        role,
        phoneNumber,
        email,
        address
      }
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: `Error updating user: ${error.message}` });
  }
};

const studentSignIn = async (req, res) => {
  const qrValue = req.body.qrValue;

  try {
    // Fetch all users from the database
    const users = await prisma.user.findMany();

    // Loop through the users to find one with a matching password
    let matchedUser = null;
    for (const user of users) {
      if (await verifyPassword(qrValue, user.password)) {
        matchedUser = user;
        break;
      }
    }

    // If no matching user is found, return an error
    if (!matchedUser) {
      return res.status(401).json({ error: 'Invalid QR code' });
    }

    // Check if the role matches the expected role

    // Create an access token for the user
    const accessToken = createAccessToken(matchedUser);

    // Respond with the user information and access token
    res.json({
      message: 'Sign-in successful',
      user: matchedUser,
      accessToken,
    });
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


module.exports = { getAllClassesWithRelatedData, createStudent, fetchAllStudents, deleteStudent, updateStudent, studentSignIn };
