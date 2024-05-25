const PrismaClient = require('@prisma/client').PrismaClient;
const prisma = new PrismaClient();

const addCourse = async (req, res) => {
    try {
        const { name } = req.body; // Get the course name from the request body
    
        if (!name) {
          return res.status(400).json({ error: "Course name is required" });
        }
    
        // Create a new course in the database
        const newCourse = await prisma.course.create({
          data: {
            name,
          },
        });
    
        // Return the newly created course
        return res.status(201).json(newCourse);
      } catch (error) {
        console.error("Error creating course:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
}


// Fetch all available courses
const getCourses = async (req, res) => {
  try {
    // Fetch all courses from the Course model
    const courses = await prisma.course.findMany();

    // Return the courses in the response
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "An error occurred while fetching courses." });
  }
};

const updateCourse = async (req, res) => {
  try {
    const courseId = parseInt(req.params.id, 10); // Retrieve the course ID from the URL parameter
    const { name } = req.body; // Retrieve the new course name from the request body

    // Update the course with the new name
    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: { name },
    });

    // Return the updated course information
    res.status(200).json({ message: 'Course updated successfully', updatedCourse });
  } catch (error) {
    console.error('Error updating course:', error);

    // Handle specific errors, such as invalid ID or constraints violations
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Course not found' });
    }

    // General error handling
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const courseId = parseInt(req.params.id, 10); // Retrieve the course ID from the URL parameter

    // Delete the course with the given ID
    const deletedCourse = await prisma.course.delete({
      where: { id: courseId },
    });

    // Return a success message
    res.status(200).json({ message: 'Course deleted successfully', deletedCourse });
  } catch (error) {
    console.error('Error deleting course:', error);

    // Handle specific errors such as a non-existent course
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Course not found' });
    }

    // General error handling
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {addCourse, getCourses, updateCourse, deleteCourse}