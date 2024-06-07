import React, { useState, useEffect } from "react";
import { CiFilter } from "react-icons/ci";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import DataTable from "react-data-table-component";
import { FaCirclePlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import axios from "axios";

const modalCustomStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    padding: "2rem",
    borderRadius: "0.5rem",
    zIndex: 1000, // High z-index to ensure modal appears above other content
  },
};

const ManageResult = () => {
  const [data, setData] = useState([]); // Data for the table
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [filterValue, setFilterValue] = useState("");
  const [filterType, setFilterType] = useState("name"); // Default filter type
  const [modalIsOpen, setModalIsOpen] = useState(false); // Modal state
  const [currentExam, setCurrentExam] = useState(null); // Selected exam for view/edit
  const [modalType, setModalType] = useState(""); // 'view' or 'edit' mode for the modal
  const [originalExam, setOriginalExam] = useState([]);

  // Define columns for the data table
  const columns = [
    {
      name: (
        <div className="font-semibold text-lg text-gray-900">Exam Name</div>
      ),
      selector: (row) => row.examName,
      sortable: true,
      wrap: true,
    },
    {
      name: <div className="font-semibold text-lg text-gray-900">Student</div>,
      selector: (row) => row.studentName,
      sortable: true,
      wrap: true,
    },
    {
      name: <div className="font-semibold text-lg text-gray-900">Result</div>,
      selector: (row) => row.result,
      sortable: true,
      wrap: true,
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
          <button className="px-2" onClick={() => handleDelete(row.resultId)}>
            <FaTrash size={17} />
          </button>
        </div>
      ),
    },
  ];

  // Fetch data from the backend when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const examId = sessionStorage.getItem("examId");
        const response = await axios.post(
          "http://localhost:4000/result/getResult",
          { examId }
        ); // Backend endpoint
        const formattedResults = response.data.map(result => ({
          studentId: result.studentId,
          examId: result.examId,
          resultId: result.resultId,
          examName: result.examName,
          result: result.result,
          studentName: result.studentName,
        }));
        setData(formattedResults.reverse()); // Set fetched data
        setOriginalExam(formattedResults.reverse());
        console.log(formattedResults);
        setLoading(false); // Turn off loading
      } catch (err) {
        setError(err.message); // Handle error
        setLoading(false); // Turn off loading in case of error
      }
    };

    fetchData(); // Trigger data fetching on component mount
  }, []); // Empty dependency array to fetch data once

  // Handle view action
  const handleView = (exam) => {
    setCurrentExam(exam); // Set current exam
    setModalType("view"); // Set to view mode
    setModalIsOpen(true); // Open modal
  };

  // Handle edit action
  const handleEdit = (exam) => {
    setCurrentExam(exam); // Set current exam
    setModalType("edit"); // Set to edit mode
    setModalIsOpen(true); // Open modal
  };

  // Handle delete action
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/result/deleteResult/${id}`); // Endpoint for deleting
      setData(data.filter((exam) => exam.resultId !== id)); // Remove exam
    } catch (err) {
      console.error("Error deleting result:", err);
    }
  };

  // Handle field changes in modal form (for editing)
  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setCurrentExam({
      ...currentExam,
      [name]: value,
    });
  };

  // Handle updating the result
  const handleUpdateExam = async () => {
    try {
      await axios.put(
        `http://localhost:4000/result/updateResult/${currentExam.resultId}`,
        { result: currentExam.result }
      ); // Endpoint for updating
      setData(
        data.map((exam) =>
          exam.resultId === currentExam.resultId ? currentExam : exam
        )
      ); // Update data with modified exam
      setModalIsOpen(false); // Close modal
    } catch (err) {
      console.error("Error updating result:", err);
    }
  };

  // Handle filter value change
  const handleFilterValueChange = (event) => {
    const value = event.target.value;
    setFilterValue(value);

    const filteredData = originalExam.filter((row) => {
      if (filterType === "name") {
        return row.examName.toLowerCase().includes(value.toLowerCase());
      } else {
        return true; // Default to show all records
      }
    });

    setData(filteredData); // Update the filtered data
  };

  // Handle filter type change
  const handleFilterTypeChange = (event) => {
    const value = event.target.value;
    setFilterType(value);

    const filteredData = data.filter((row) => {
      if (value === "name") {
        return row.examName.toLowerCase().includes(filterValue.toLowerCase());
      } else {
        return true; // Default to all records if filter type is not specified
      }
    });

    setData(filteredData); // Update data with filtered results
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error state
  }

  return (
    <div className="justify-center items-center h-screen-minus-18">
      <div className="px-16 py-20 text-lg font-bold text-gray-900">
        Manage Results
      </div>
      <div className="px-16 py-4 w-full max-w-4xl">
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
          </select>
        </div>

        <div>
          <DataTable
            columns={columns}
            data={data} // Use fetched data
            selectableRows
            pagination
          ></DataTable>
        </div>
      </div>

      {/* Modal for view and edit */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={modalCustomStyles}
        contentLabel={modalType === "edit" ? "Edit Result" : "View Result"}
      >
        <div className="flex flex-col space-y-4 w-300">
          <h2 className="text-xl font-semibold text-center">
            {modalType === "edit" ? "Edit Result" : "View Result"}
          </h2>
          <div className="flex flex-col">
            <label>Student Name:</label>
            <input
              type="text"
              name="studentName"
              value={currentExam?.studentName || ""}
              readOnly
              className="border border-gray-300 p-2 rounded-md outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label>Exam Name:</label>
            <input
              type="text"
              name="examName"
              value={currentExam?.examName || ""}
              readOnly
              className="border border-gray-300 p-2 rounded-md outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label>Result:</label>
            <input
              type="text"
              name="result"
              value={currentExam?.result || ""}
              onChange={handleFieldChange}
              className="border border-gray-300 p-2 rounded-md outline-none"
              disabled={modalType === "view"}
            />
          </div>
          {modalType === "edit" ? (
            <button onClick={handleUpdateExam}>Update</button>
          ) : (
            <button onClick={() => setModalIsOpen(false)}>Close</button>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ManageResult;
