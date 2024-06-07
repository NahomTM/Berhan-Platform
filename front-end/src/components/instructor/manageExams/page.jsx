import React, { useState, useEffect } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { CiFilter } from "react-icons/ci";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import DataTable from "react-data-table-component";
import Modal from "react-modal";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const modalCustomStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    width: "55%",
    transform: "translate(-50%, -50%)",
    padding: "2rem",
    borderRadius: "0.5rem",
    zIndex: 1000, // High z-index to ensure modal appears above other content
  },
};

const ManageExam = () => {
  const [examData, setExamData] = useState([]);
  const [originalExam, setOriginalExam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterValue, setFilterValue] = useState("");
  const [filterType, setFilterType] = useState("name");
  const [currentExam, setCurrentExam] = useState(null);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    course: "",
    examName: "",
    numberOfQuestions: "",
    examCode: "",
    examDate: "",
    duration: "",
    questions: [],
  });

  const [step, setStep] = useState(0);

  const columns = [
    {
      name: <div className="font-semibold text-lg text-gray-900">Name</div>,
      selector: (row) => row.examName,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div className="flex items-center text-md">
          <span className="mr-2">{row.examName}</span>
        </div>
      ),
    },
    {
      name: (
        <div className="font-semibold text-lg text-gray-900">Exam Code</div>
      ),
      selector: (row) => row.examCode,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div className="flex items-center text-md">
          <span className="mr-2">{row.examCode}</span>
        </div>
      ),
      width: '170px',
    },
    {
      name: (
        <div className="font-semibold text-lg text-gray-900">Course Name</div>
      ),
      selector: (row) => row.course,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div className="flex items-center text-md">
          <span className="mr-2">{row.course}</span>
        </div>
      ),
      width: "250px",
    },
    {
      name: <div className="font-semibold text-lg text-gray-900">Results</div>,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <button
          onClick={() => {
            handleResult(row);
          }}
        >
          <div className="flex items-center text-md text-blue-600 cursor-pointer hover:text-blue-800 hover:underline">
            <span className="mr-2">Click here</span>
          </div>
        </button>
      ),
    },
    {
      name: (
        <div className="font-semibold text-lg text-gray-900 justify-center items-center px-3 w-160">
          Actions
        </div>
      ),
      cell: (row) => (
        <div className="flex">
          <button className="px-2" onClick={() => handleView(row)}>
            <FaEye size={17} />
          </button>
          <button className="px-2" onClick={() => handleEdit(row)}>
            <FaEdit size={17} />
          </button>
          <button className="px-2" onClick={() => handleDelete(row.examId)}>
            <FaTrash size={17} />
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken =
          localStorage.getItem("accessToken") ||
          sessionStorage.getItem("accessToken");
        const response = await axios.get("http://localhost:4000/exam/getExam", {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the access token in the Authorization header
          },
        });
        const formatDate = (dateString) => {
          // Convert the given date string to "MM/DD/YYYY"
          const date = new Date(dateString);
          const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Add leading zero for month
          const day = date.getDate().toString().padStart(2, "0"); // Add leading zero for day
          const year = date.getFullYear();
          return `${month}/${day}/${year}`;
        };
        const formattedData = response.data.map((exam) => ({
          examId: exam.examId,
          course: exam.course,
          examName: exam.examName,
          examCode: exam.examCode,
          duration: exam.duration,
          numberOfQuestions: exam.numberOfQuestions,
          examDate: formatDate(exam.examDate),
          questions: exam.questions.map((question) => ({
            questionId: question.questionId,
            question: question.question,
            choices: question.choices, // Access the 'choices' array directly
            correctAnswer: question.correctAnswer,
          })),
        }));
        // Set the formData state
        setExamData(formattedData);
        setOriginalExam(formattedData);
        setFormData(formattedData);
        console.log(formattedData);
        setLoading(false);
      } catch (error) {
        setError(error.message); // Handle error
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const handleView = (row) => {
    setCurrentExam(row); // Set the current employee to be viewed
    setModalType("view"); // Set modal to view mode
    setModalIsOpen(true); // Open modal
  };
  const handleEdit = async (row) => {
    const accessToken =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    const response = await axios.get("http://localhost:4000/exam/getCourse", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setCourses(response.data.courses);
    setCurrentExam(row); // Set the current employee to be edited
    setModalType("edit"); // Set modal to edit mode
    setModalIsOpen(true); // Open modal
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/exam/deleteExam/${id}`); // Your backend endpoint for deletion
      const updatedExam = examData.filter((e) => e.id !== id); // Remove from state
      setExamData(updatedExam); // Update state
    } catch (err) {
      console.error("Error deleting exam:", err);
    }
  };
  const handleModalClose = () => {
    setModalIsOpen(false);
  };

  const handleResult = async (row) => {
    const examId = row.examId 
    const response = await axios.post(
      "http://localhost:4000/result/getResult",
      { examId }
    );

    if (response.data.msg === "failed") {
      alert("No results for this exam yet");
    } else {
      sessionStorage.setItem("examId", row.examId);
      navigate("/manageResult");
    }
  };

  const handleUpdateExam = async () => {
    try {
      console.log("current exam: ", currentExam);
      await axios
        .put(
          `http://localhost:4000/question/updateExam/${currentExam.examId}`,
          currentExam
        )
        .then((res) => {
          const updatedExam = examData.map((e) =>
            e.id === currentExam.id ? currentExam : e
          ); // Update state with new data

          setExamData(updatedExam); // Update state
          setModalIsOpen(false);
          setStep(0);
        }); // Update endpoint
      // Close modal
    } catch (err) {
      console.error("Error updating exam:", err);
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = currentExam.questions.map((question, idx) => {
      if (idx === index) {
        return { ...question, [field]: value };
      }
      return question;
    });
    setCurrentExam((prevExam) => ({
      ...prevExam,
      questions: updatedQuestions,
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentExam((prevExam) => ({
      ...prevExam,
      [name]: value,
    }));
  };
  const handleFilterValueChange = (event) => {
    const value = event.target.value;
    setFilterValue(value);

    if (value.trim() === "") {
      // If filter input is cleared, reset to the original dataset
      setExamData(originalExam);
    } else {
      const filteredData = originalExam.filter((row) => {
        if (filterType === "name") {
          return row.examName.toLowerCase().includes(value.toLowerCase());
        } else if (filterType === "examCode") {
          return row.examCode.toLowerCase().includes(value.toLowerCase());
        } else if (filterType === "courseName") {
          return row.course.toLowerCase().includes(value.toLowerCase());
        } else {
          return true; // Default to show all records
        }
      });

      setExamData(filteredData); // Update the filtered data
    }
  };
  const handleFilterTypeChange = (event) => {
    const value = event.target.value;
    setFilterType(value);

    const filteredData = examData.filter((row) => {
      if (filterType === "name") {
        return row.examName.toLowerCase().includes(filterValue.toLowerCase());
      } else if (filterType === "examCode") {
        return row.examCode.toLowerCase().includes(filterValue.toLowerCase());
      } else if (filterType === "courseName") {
        return row.course.toLowerCase().includes(filterValue.toLowerCase());
      } else {
        return true; // Default to show all records
      }
    });

    setExamData(filteredData); // Update the filtered data
  };
  if (loading) {
    return <div>Loading...</div>; // Display loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error state
  }

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <label className="block">Course</label>
              <select
                name="course"
                value={
                  modalType === "view" ? currentExam.course : formData.course
                }
                onChange={handleInputChange}
                disabled={modalType === "view"}
                className="border p-2 w-full"
              >
                {modalType === "view" ? (
                  <option value={currentExam.course}>
                    {currentExam.course}
                  </option>
                ) : (
                  <>
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block">Exam Name</label>
              <input
                type="text"
                name="examName"
                value={currentExam?.examName || ""}
                onChange={handleInputChange}
                disabled={modalType === "view"}
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label className="block">Exam Code</label>
              <input
                type="text"
                name="examCode"
                value={currentExam?.examCode || ""}
                onChange={handleInputChange}
                disabled={modalType === "view"}
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label className="block">Duration</label>
              <input
                type="text"
                name="duration"
                value={currentExam?.duration}
                disabled={modalType === "view"}
                onChange={handleInputChange}
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label className="block">Number of Questions</label>
              <input
                type="text"
                name="numberOfQuestions"
                value={currentExam?.numberOfQuestions || ""}
                disabled={modalType === "view"}
                onChange={handleInputChange}
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label className="block">Exam Date</label>
              <input
                type="text"
                name="examDate"
                value={currentExam?.examDate || ""}
                onChange={handleInputChange}
                disabled={modalType === "view"}
                className="border p-2 w-full"
              />
            </div>
          </div>
        );
      default:
        const question = currentExam?.questions[step - 1];
        if (!question) return null;
        return (
          <div className="space-y-4">
            <div>
              <label className="block">Question {step}</label>
              <input
                type="text"
                value={question.question}
                onChange={(e) =>
                  handleQuestionChange(step - 1, "question", e.target.value)
                }
                disabled={modalType === "view"}
                className="border p-2 w-full"
              />
            </div>
            {["A", "B", "C", "D"].map((choice, idx) => (
              <div key={idx}>
                <label className="block">Choice {choice}</label>
                <input
                  type="text"
                  value={question.choices[idx]}
                  onChange={(e) =>
                    handleQuestionChange(step - 1, "choices", [
                      ...question.choices.slice(0, idx),
                      e.target.value,
                      ...question.choices.slice(idx + 1),
                    ])
                  }
                  disabled={modalType === "view"}
                  className="border p-2 w-full"
                />
              </div>
            ))}
            <div>
              <label className="block">Correct Answer</label>
              <div className="space-x-4">
                {["A", "B", "C", "D"].map((choice, idx) => (
                  <label key={idx} className="inline-flex items-center">
                    <input
                      type="radio"
                      name={`correctAnswer-${step - 1}`}
                      value={choice}
                      checked={question.correctAnswer === choice}
                      onChange={(e) =>
                        handleQuestionChange(
                          step - 1,
                          "correctAnswer",
                          e.target.value
                        )
                      }
                      disabled={modalType === "view"}
                      className="form-radio"
                    />
                    <span className="ml-2">{choice}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };
  return (
    <div className="justify-center items-center h-screen-minus-18">
      <div className="px-16 py-20 text-lg font-bold text-gray-900">
        Manage Exam
      </div>
      <div className="px-16 py-4 max-w-5xl">
        <div className="mb-3 text-lg font-semibold flex text-gray-700 hover:text-gray-900">
          <Link to="/newExam">
            <button className="flex">
              Create new Exam
              <span className="ml-1 py-1">
                <FaCirclePlus color="green" size={22} />
              </span>
            </button>
          </Link>
        </div>
        <div className="flex items-center mb-5">
          <input
            type="text"
            value={filterValue}
            onChange={handleFilterValueChange}
            className="border-2 border-gray-900 outline-none w-48 pl-2 rounded-sm"
            placeholder="Enter filter value"
          />
          <label>
            <CiFilter color="orange" size={32} />
          </label>
          <span className="ml-3">Filter By</span>
          <select
            value={filterType}
            onChange={handleFilterTypeChange}
            className="appearance-none px-1 py-1/2 items-center border-2 border-gray-900 rounded-md focus:outline-none ml-2 text-center text-gray-900"
          >
            <option value="name">Name</option>
            <option value="examCode">Exam Code</option>
            <option value="courseName">Exam Code</option>
          </select>
        </div>

        <div className="max-w-5xl">
          <DataTable
            columns={columns}
            data={examData} // Use fetched data
            selectableRows
            pagination
          ></DataTable>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleModalClose}
        style={modalCustomStyles}
        contentLabel={modalType === "edit" ? "Edit Employee" : "View Employee"}
        ariaHideApp={false}
      >
        <div className="space-y-4 p-4">
          {renderStepContent(step)}
          <div className="flex justify-between">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Previous
              </button>
            )}
            {step < currentExam?.questions.length ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                onClick={handleUpdateExam}
                className= {`${modalType === "edit" ? "bg-green-500 text-white px-4 py-2 rounded" : "hidden"}`}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageExam;
