import React, { useState, useEffect } from "react";
import { FaBook } from "react-icons/fa";
import axios from "axios";

const NewCourse = () => {
  const [formData, setFormData] = useState({
    courseName: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrors({});
      setSuccessMessage("");
    }, 3000); // Clear errors and success message after 3 seconds
    return () => clearTimeout(timer);
  }, [errors, successMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    // Validation
    if (!formData.courseName.trim()) {
      newErrors.courseName = "Course name is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // POST request to create a new course
      const response = await axios.post("http://localhost:4000/course/newCourse", {
        name: formData.courseName,
      });

      setSuccessMessage("Course created successfully");
      setFormData({ courseName: "" }); // Clear the input field
    } catch (error) {
      if (error.response) {
        // Server returned a specific error
        setErrors({ courseName: error.response.data.error });
      } else {
        console.error("Error creating course:", error);
        setErrors({ courseName: "An error occurred while creating the course" });
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-400">
      <div className="w-3/4 max-w-4xl bg-white rounded-md shadow p-6">
        <form onSubmit={handleSubmit}>
          <h1 className="font-bold text-2xl text-gray-800 mb-6">Create New Course</h1>
          <div className="mb-4">
            <label className="font-semibold text-gray-800">Course Name</label>
            <div className="flex items-center border-2 border-gray-400 rounded-md mt-2">
              <FaBook className="p-2 text-gray-500" />
              <input
                type="text"
                name="courseName"
                value={formData.courseName}
                onChange={handleChange}
                placeholder="Enter course name"
                className="w-full px-3 py-2 outline-none"
              />
            </div>
            {errors.courseName && (
              <span className="text-red-500 text-sm">{errors.courseName}</span>
            )}
          </div>

          <div className="text-right">
            <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">
              Create Course
            </button>
          </div>
          {successMessage && (
            <div className="text-gray-700 text-center mt-4">{successMessage}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default NewCourse;
