const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { hashPassword } = require('../utils/passwordUtils');
const generateRandomPassword = () => {
  // Generate a secure random password
  return crypto.randomBytes(8).toString('hex');
};

const generateRandomUsername = (fName, lName) => {
  // Generate a random username
  const randomNum = Math.floor(Math.random() * 1000);
  return `${fName.toLowerCase()}${lName.toLowerCase()}${randomNum}`;
};

const sendEmail = async (email, username, password) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Gmail SMTP server
    port: 465, // SMTPS default port
    secure: true, // Use SSL/TLS
    auth: {
      user: 'nahom6297@gmail.com', // Your Gmail address
      pass: process.env.EMAIL_PASSWORD, // Gmail App Password or similar
    },
  });

  const mailOptions = {
    from: 'nahom6297@gmail.com',
    to: email,
    subject: 'Your Temporary Credentials',
    text: `Hello,\n\nYour temporary username is: ${username}\nYour temporary password is: ${password}\nPlease change your password after logging in.\n\nRegards,\nYour Team`,
  };

  await transporter.sendMail(mailOptions);
};

const addEmployee = async (req, res) => {
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

  const randomPassword = generateRandomPassword();
  const randomUsername = generateRandomUsername(fName, lName);

  try {

    const hashedPassword = await hashPassword(randomPassword)
    const normalizedRole = role.toLowerCase()
    // Create the new user in the User table with generated username and password
    const newUser = await prisma.user.create({
      data: {
        firstName: fName,
        middleName: mName,
        lastName: lName,
        gender,
        dateOfBirth: new Date(dob),
        role: normalizedRole,
        phoneNumber: phone,
        email,
        password: hashedPassword,
        username: randomUsername,
        address,
        profilePic: "uploads/defaultProfilePage.svg",
      },
    });

    // Send the email with the temporary credentials
    await sendEmail(email, randomUsername, randomPassword);

    // If the role is "Instructor" and there are selected courses, create the associated classes
    if (normalizedRole === 'instructor' && selectedCourses.length > 0) {
      console.log(`Selected Courses: ${JSON.stringify(selectedCourses)}`); // Log selected courses
      
      const courses = await prisma.course.findMany({
        where: {
          name: {
            in: selectedCourses,
          },
        },
      });

      console.log(`Fetched Courses: ${JSON.stringify(courses)}`); // Debug fetched courses
      
      const classData = courses.map((course) => ({
        name: `${fName} ${course.name}`,
        courseId: course.id,
        userId: newUser.id,
      }));

      console.log(`Classes to Create: ${JSON.stringify(classData)}`); // Debug class data
      
      await prisma.class.createMany({
        data: classData,
      });
    }

    res.status(201).json({
      message: 'Employee added successfully',
      user: newUser,
    });

  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({
      message: 'Failed to add employee',
    });
  }
};

async function fetchAllEmployees(req, res) {
  try {
    const employees = await prisma.user.findMany({
      where: {
        role: {
          in: ["admin", "instructor"]
        }
      }
    });
    res.status(200).json(employees); // Respond with the list of employees with roles "admin" or "instructor"
  } catch (error) {
    res.status(500).json({ error: `Error fetching employees: ${error.message}` }); // Handle error
  }
}


// Delete an employee
async function deleteEmployee(req, res) {
  const employeeId = parseInt(req.params.id, 10); // Extract employee ID from URL parameter
  try {
    await prisma.user.delete({
      where: { id: employeeId },
    });
    res.status(200).json({ message: "Employee deleted successfully" }); // Respond with success message
  } catch (error) {
    res.status(500).json({ error: `Error deleting employee: ${error.message}` }); // Handle error
  }
}

// Update an employee
async function updateEmployee(req, res) {
  const employeeId = parseInt(req.params.id, 10); // Employee ID from URL parameter
  const { firstName, role, ...otherFields } = req.body; // Data from the request body

  try {
    const existingEmployee = await prisma.user.findUnique({
      where: { id: employeeId },
    });

    if (!existingEmployee) {
      return res.status(404).json({ message: "Employee not found" }); // Return 404 if not found
    }

    // Update the employee with new data
    const updatedEmployee = await prisma.user.update({
      where: { id: employeeId },
      data: {
        firstName,
        role,
        ...otherFields,
      },
    });

    // Handle the case when an instructor's first name changes
    if (
      existingEmployee.role === "instructor" &&
      existingEmployee.firstName !== firstName
    ) {
      const classes = await prisma.class.findMany({
        where: { userId: employeeId },
      });

      // Update class names, changing only the first word (instructor's first name)
      for (const classInstance of classes) {
        const parts = classInstance.name.split(" ");
        if (parts.length > 1) {
          parts[0] = firstName; // Change the first word
          const newName = parts.join(" "); // Rebuild the class name
          await prisma.class.update({
            where: { id: classInstance.id },
            data: { name: newName },
          });
        }
      }
    }

    // If role changes from instructor to admin, clear the instructor's name from class names
    if (existingEmployee.role === "instructor" && role === "admin") {
      await prisma.class.updateMany({
        where: { userId: employeeId },
        data: {
          name: {
            set: "", // Clear class name
          },
        },
      });
    }

    res.status(200).json(updatedEmployee); // Respond with the updated employee
  } catch (error) {
    res.status(500).json({ error: `Error updating employee: ${error.message}` }); // Handle error
  }
}

// Export functions for use in other modules
module.exports = {
  fetchAllEmployees,
  deleteEmployee,
  updateEmployee,
  addEmployee
};



