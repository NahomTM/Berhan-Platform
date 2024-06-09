import React, { useState, useEffect } from "react";
import {
  FaAddressBook,
  FaFacebookF,
  FaPhone,
  FaRegCalendarAlt,
  FaTimes,
} from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { MdEmail, MdLock, MdMale, MdFemale } from "react-icons/md";
import { IoIosPerson } from "react-icons/io";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    fName: "",
    mName: "",
    lName: "",
    gender: "male",
    dob: "",
    role: "Select",
    email: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [submitError, setSubmitError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/course/getCourses"
        ); // Ensure correct endpoint
        setAvailableCourses(response.data);
        setLoadingCourses(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // If the role changes to something other than "Instructor", clear the selected courses
    if (name === "role" && value !== "Instructor") {
      setSelectedCourses([]);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrors({});
    }, 3000);
    return () => clearTimeout(timer);
  }, [errors]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any required field is empty
    const requiredFields = ['fName', 'lName', 'email', 'phone', 'dob', 'role', 'address'];
    const isEmptyField = requiredFields.some(field => !formData[field].trim() || (field === 'role' && formData[field] === 'Select'));

    if (isEmptyField) {
        toast.error("All fields are required");
        return;
    }

    // Individual validation checks
    if (!/^[a-zA-Z]+$/.test(formData.fName.trim())) {
        toast.error("First Name must contain only letters");
        return;
    }

    if (!/^[a-zA-Z]*$/.test(formData.mName.trim())) {
        toast.error("Middle Name must contain only letters (if provided)");
        return;
    }

    if (!/^[a-zA-Z]+$/.test(formData.lName.trim())) {
        toast.error("Last Name must contain only letters");
        return;
    }

    if (
        !validateEmail(formData.email.trim()) ||
        formData.email.trim().charAt(0) === "@" ||
        formData.email.trim().charAt(formData.email.trim().length - 1) === "."
    ) {
        toast.error("Invalid email address");
        return;
    }

    if (!/^\+251\d{9}$/.test(formData.phone.trim())) {
        toast.error("Invalid phone number format");
        return;
    }

    const today = new Date();
    const dobDate = new Date(formData.dob);
    if (dobDate >= today) {
        toast.error("Date of Birth must be in the past");
        return;
    }

    if (formData.role === "Select") {
        toast.error("Role must be selected");
        return;
    }

    if (!formData.address.trim()) {
        toast.error("Address is required");
        return;
    }

    // If all validations pass, submit the form
    try {
        const response = await axios.post(
            "http://localhost:4000/employee/addEmployee",
            {
                ...formData,
                selectedCourses,
            }
        );
        setSuccessMessage("Employee added successfully");
        console.log("Form submitted:", response.data);
        // Handle success, like showing a success message or redirecting
    } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("An error occurred while submitting the form.");
    }
};


  const handleCourseSelection = (e) => {
    const selectedCourseName = e.target.value;
    if (selectedCourseName !== "Select Course") {
      setSelectedCourses([...selectedCourses, selectedCourseName]);
      setAvailableCourses(
        availableCourses.filter((course) => course.name !== selectedCourseName)
      );
    }
  };

  const handleRemoveCourse = (courseName) => {
    setSelectedCourses(selectedCourses.filter((c) => c !== courseName));
    setAvailableCourses([...availableCourses, { name: courseName }]);
  };

  return (
    <div className="relative px-14 py-12 -ml-10 items-center justify-center flex overflow-y-auto">
      <div className="bg-white rounded-md shadow-custom items-center flex flex-col w-3/4 max-w-4xl">
        <form onSubmit={handleSubmit}>
          <div className="text-left font-bold mt-10">
            Add New<span className="text-orange-500"> Employee</span>
          </div>
          <div className="flex flex-col mt-10">
            <div className="flex-col">
              <div className="mb-3 text-lg font-semibold text-gray-500">
                User Information
              </div>
              <div className="flex">
                <div className="flex-col">
                  <div className="text-md font-semibold text-gray-900 mb-2">
                    First Name
                  </div>
                  <div className="bg-white w-72 p-1 flex items-center border-2 border-gray-600 rounded-sm mb-3">
                    <IoIosPerson className="m-1" />
                    <input
                      type="text"
                      name="fName"
                      placeholder="First Name"
                      className="bg-white outline-none text-sm flex-1"
                      value={formData.fName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex-col ml-12">
                  <div className="text-md font-semibold text-gray-900 mb-2">
                    Middle Name
                  </div>
                  <div className="bg-white w-72 p-1 flex items-center border-2 border-gray-600 rounded-sm mb-3">
                    <IoIosPerson className="m-1" />
                    <input
                      type="text"
                      name="mName"
                      placeholder="Middle Name"
                      className="bg-white outline-none text-sm flex-1"
                      value={formData.mName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="flex">
                <div className="flex-col">
                  <div className="text-md font-semibold text-gray-900 mb-2">
                    Last Name
                  </div>
                  <div className="bg-white w-72 p-1 flex items-center border-2 border-gray-600 rounded-sm mb-3">
                    <IoIosPerson className="m-1" />
                    <input
                      type="text"
                      name="lName"
                      placeholder="Last Name"
                      className="bg-white outline-none text-sm flex-1"
                      value={formData.lName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex ml-12">
                  <div className="flex-col">
                    <div className="text-md font-semibold text-gray-900 mb-2">
                      Gender
                    </div>
                    <div className="flex">
                      <select
                        id="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        name="gender"
                        className="appearance-none border-2 text-center border-gray-600 rounded-sm px-2 py-1 focus:outline-none"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      <span className="pointer-events-none text-gray-700 ml-1 mt-0.5">
                        {formData.gender === "male" ? (
                          <MdMale size={30} />
                        ) : (
                          <MdFemale size={30} />
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex-col ml-5">
                    <div className="text-md font-semibold text-gray-900 mb-2">
                      Date of Birth
                    </div>
                    <div className="flex">
                      <input
                        type="date"
                        id="date"
                        className="border-2 border-gray-600 rounded-sm px-1/2 py-custom focus:outline-none"
                        value={formData.dob}
                        onChange={handleChange}
                        name="dob"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex">
                <div className="flex-col">
                  <div className="text-md font-semibold text-gray-900 mb-2">
                    Role
                  </div>
                  <div className="bg-white w-72 flex items-center border-2 border-gray-600 rounded-sm mb-3">
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className=" w-64 appearance-none px-8 rounded-sm py-1 focus:outline-none"
                    >
                      <option value="Select">Select</option>
                      <option value="Instructor">Instructor</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="flex-col ml-12">
                  <div className="text-md font-semibold text-gray-900 mb-2">
                    Courses
                  </div>
                  <div className="bg-white w-72 p-1 flex items-center border-2 border-gray-600 rounded-sm mb-3">
                    <select
                      id="courses"
                      name="courses"
                      value="Select Course"
                      disabled={formData.role !== "Instructor"}
                      onChange={handleCourseSelection}
                      className="w-64 appearance-none px-8 rounded-sm py-1/2 focus:outline-none"
                    >
                      <option value="Select Course">Select Course</option>
                      {formData.role === "Instructor" &&
                        availableCourses.map((course) => (
                          <option key={course.name} value={course.name}>
                            {course.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="border w-623 border-gray-300 mt-4"></div>
            <div className="flex-col">
              <div className="mb-3 text-lg font-semibold text-gray-500 mt-5">
                Contact Information
              </div>
              <div className="flex">
                <div className="flex-col">
                  <div className="text-md font-semibold text-gray-900 mb-2">
                    Email
                  </div>
                  <div className="bg-white w-72 p-1 flex items-center border-2 border-gray-600 rounded-sm mb-3">
                    <MdEmail className="m-1" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="bg-white outline-none text-sm flex-1"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex-col ml-12">
                  <div className="text-md font-semibold text-gray-900 mb-2">
                    Phone Number
                  </div>
                  <div className="bg-white w-72 p-1 flex items-center border-2 border-gray-600 rounded-md mb-3">
                    <FaPhone className="m-1" />
                    <input
                      type="text"
                      name="phone"
                      placeholder="+XXX-XXX-XXXX"
                      className="bg-white outline-none text-sm flex-1"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="flex-col">
                <div className="text-md font-semibold text-gray-900 mb-2">
                  Address
                </div>
                <div className="bg-white w-623 p-1 flex items-center border-2 border-gray-600 rounded-sm mb-3">
                  <FaAddressBook className="m-1" />
                  <input
                    type="text"
                    name="address"
                    placeholder="          Bole subcity Addis Ababa, Ethiopia"
                    className="bg-white outline-none text-sm flex-1"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="text-right mb-4 mt-5">
            <button
              type="submit"
              className="bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-full px-6 py-2.5 text-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
              style={{
                minHeight: "40px", // Adjusted height
                lineHeight: "1", // Center the text vertically
              }}
            >
              Submit
            </button>
            {successMessage && (
              <div className="text-gray-700 text-center mt-4">{successMessage}</div>
            )}
          </div>
        </form>
      </div>
      {formData.role === "Instructor" && selectedCourses.length > 0 && (
        <div className="ml-12 bg-white w-72 p-5 mt-10 rounded-md shadow-md h-300 overflow-y-auto">
          <div className="text-lg font-semibold text-gray-900 mb-2">
            Selected Courses
          </div>
          <ul>
            {selectedCourses.map((course) => (
              <li
                key={course}
                className="flex justify-between items-center mb-2"
              >
                {course}
                <button
                  onClick={() => handleRemoveCourse(course)}
                  className="text-red-500"
                >
                  <FaTimes />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default AddEmployee;
