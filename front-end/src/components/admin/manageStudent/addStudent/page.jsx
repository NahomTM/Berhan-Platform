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
import { ImInfo } from "react-icons/im";
import { MdOutlineRemoveCircleOutline } from "react-icons/md";
import { IoIosPerson } from "react-icons/io";
import axios from "axios";
import jsPDF from "jspdf";
import { QRCodeCanvas } from "qrcode.react";
import ReactDOM from "react-dom/client";

const AddStudent = () => {
  const [formData, setFormData] = useState({
    fName: "",
    mName: "",
    lName: "",
    gender: "male",
    dob: "",
    role: "student",
    email: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [submitError, setSubmitError] = useState(null);
  const [classInfo, setClassInfo] = useState("");
  const [fetchedCourses, setFetchedCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/student/getClass"
        ); // Ensure correct endpoint
        setAvailableCourses(response.data);
        setFetchedCourses(response.data);
        setLoadingCourses(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoadingCourses(false);
      }
    };

    fetchCourses();
    console.log(availableCourses);
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
    let newErrors = {};

    if (!formData.fName.trim()) {
      newErrors.fName = "First Name is required";
    } else if (!/^[a-zA-Z]+$/.test(formData.fName.trim())) {
      newErrors.fName = "First Name must contain only letters";
    }

    if (!formData.lName.trim()) {
      newErrors.lName = "Last Name is required";
    } else if (!/^[a-zA-Z]+$/.test(formData.lName.trim())) {
      newErrors.lName = "Last Name must contain only letters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email.trim())) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone Number is required";
    } else if (!/^\+251\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone = "Invalid phone number format";
    }

    if (!formData.dob.trim()) {
      newErrors.dob = "Date of Birth is required";
    } else {
      const today = new Date();
      const dobDate = new Date(formData.dob);
      if (dobDate >= today) {
        newErrors.dob = "Date of Birth must be in the past";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post(
          "http://localhost:4000/student/addStudent",
          {
            ...formData,
            selectedCourses,
          }
        );

        if (response.data) {
          const fullName = `${formData.fName} ${formData.mName} ${formData.lName}`;
          const qrCodeValue =`${fullName}|${formData.gender}|${formData.dob}|${formData.email}|${formData.phone}|${formData.address}`;
          await downloadPDF(formData, qrCodeValue);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setSubmitError("An error occurred while submitting the form.");
      }
    }
  };

  const downloadPDF = async (formData, qrCodeValue) => {
    const tempDiv = document.createElement("div");
    document.body.appendChild(tempDiv);

    const root = ReactDOM.createRoot(tempDiv);
    root.render(<QRCodeCanvas value={qrCodeValue} size={100} />);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const qrCodeCanvas = tempDiv.querySelector("canvas");
    const qrCodeDataURL = qrCodeCanvas.toDataURL("image/png");

    const fullName = `${formData.fName} ${formData.mName} ${formData.lName}`;

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [85.6, 53.98],
    });

    pdf.setFontSize(10);
    pdf.text("Addis Ababa Science and Technology University", 5, 10);

    pdf.setFontSize(10);
    pdf.text(`Full Name: ${fullName}`, 5, 20);
    pdf.text(`Gender: ${formData.gender}`, 5, 25);
    pdf.text(`Date of Birth: ${formData.dob}`, 5, 30);
    pdf.text(`Email: ${formData.email}`, 5, 35);
    pdf.text(`Phone: ${formData.phone}`, 5, 40);
    pdf.text(`Address: ${formData.address}`, 5, 45);

    pdf.addImage(qrCodeDataURL, "PNG", 57, 14, 25, 25);

    pdf.save(`${fullName}'s-student-id.pdf`);

    document.body.removeChild(tempDiv);
  };

  const handleCourseSelection = (e) => {
    const selectedCourseName = e.target.value;
    console.log(selectedCourseName);
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

  const handleClassInfo = (course) => {
    const selectedUser = fetchedCourses.filter((obj) => obj.name == course)[0]
      .user;
    const selectedCourse = fetchedCourses.filter((obj) => obj.name == course)[0]
      .course;
    setClassInfo(
      `This class has the course ${selectedCourse.name} and instructor ${
        selectedUser.firstName
      } ${selectedUser.middleName ? selectedUser.middleName + " " : ""}${
        selectedUser.lastName
      }`
    );
  };

  return (
    <div className="relative justify-center -ml-10 px-14 items-center py-12 flex overflow-y-auto">
      <div className=" justify-center items-center bg-white rounded-md shadow-custom flex flex-col w-3/4 max-w-4xl">
        <form onSubmit={handleSubmit}>
          <div className="text-left font-bold mt-10">
            Add New<span className="text-orange-500"> Student</span>
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
                  {errors.fName && (
                    <div className="text-red-500 text-sm">{errors.fName}</div>
                  )}
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
                  {errors.lName && (
                    <div className="text-red-500 text-sm">{errors.lName}</div>
                  )}
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
                    {errors.dob && (
                      <div className="text-red-500 text-sm">{errors.dob}</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex">
                <div className="flex-col">
                  <div className="text-md font-semibold text-gray-900 mb-2">
                    Class
                  </div>
                  <div className="bg-white w-72 p-1 flex items-center border-2 border-gray-600 rounded-sm mb-3">
                    <select
                      id="courses"
                      name="courses"
                      value="Select Course"
                      onChange={handleCourseSelection}
                      className="w-68 appearance-none px-1 -ml-1 rounded-sm py-1/2 focus:outline-none"
                    >
                      <option value="Select Course">Select Class</option>
                      {availableCourses.map((course) => (
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
                  {errors.email && (
                    <div className="text-red-500 text-sm">{errors.email}</div>
                  )}
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
                  {errors.phone && (
                    <div className="text-red-500 text-sm">{errors.phone}</div>
                  )}
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
          </div>
        </form>
      </div>
      {selectedCourses.length > 0 && (
        <div>
          <div className=" bg-white w-400 ml-3 px-3 py-4 mt-10 rounded-md shadow-md h-300 overflow-y-auto">
            <div className="text-lg font-semibold text-gray-900 mb-2">
              Selected Class
            </div>
            <ul>
              {selectedCourses.map((course) => (
                <li key={course} className="flex mb-2">
                  {course}
                  <button
                    className="ml-2"
                    onClick={() => handleRemoveCourse(course)}
                  >
                    <MdOutlineRemoveCircleOutline size={20} />
                  </button>
                  <button
                    className="ml-1"
                    onClick={() => handleClassInfo(course)}
                  >
                    <ImInfo size={17} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {classInfo && (
            <div className="bg-white w-400 ml-3 px-3 py-4 mt-10 rounded-md shadow-md overflow-y-auto flex">
              <p>{classInfo}</p>
              <button
                onClick={() => {
                  setClassInfo("");
                }}
              >
                <FaTimes />
              </button>
              <div></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddStudent;
