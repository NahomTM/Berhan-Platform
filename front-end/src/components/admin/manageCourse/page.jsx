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

const ManageCourse = () => {
  const [data, setData] = useState([]); // Data for the table
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [filterValue, setFilterValue] = useState("");
  const [filterType, setFilterType] = useState("name"); // Default filter type
  const [modalIsOpen, setModalIsOpen] = useState(false); // Modal state
  const [currentCourse, setCurrentCourse] = useState(null); // Selected course for view/edit
  const [modalType, setModalType] = useState(""); // 'view' or 'edit' mode for the modal
  const [originalCourse, setOriginalCourse] = useState([]);
  // Define columns for the data table
  const columns = [
    {
      name: <div className="font-semibold text-lg text-gray-900">Name</div>,
      selector: (row) => row.name,
      sortable: true,
      wrap: true,
    },
    {
      name: (
        <div className="font-semibold text-lg text-gray-900 w-160 px-3">
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
          <button className="px-2" onClick={() => handleDelete(row.id)}>
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
        const response = await axios.get(
          "http://localhost:4000/course/getCourses"
        ); // Backend endpoint
        setData(response.data.reverse()); // Set fetched data
        setOriginalCourse(response.data.reverse());
        console.log(response.data);
        setLoading(false); // Turn off loading
      } catch (err) {
        setError(err.message); // Handle error
        setLoading(false); // Turn off loading in case of error
      }
    };

    fetchData(); // Trigger data fetching on component mount
  }, []); // Empty dependency array to fetch data once

  // Handle view action
  const handleView = (course) => {
    setCurrentCourse(course); // Set current course
    setModalType("view"); // Set to view mode
    setModalIsOpen(true); // Open modal
  };

  // Handle edit action
  const handleEdit = (course) => {
    setCurrentCourse(course); // Set current course
    setModalType("edit"); // Set to edit mode
    setModalIsOpen(true); // Open modal
  };

  // Handle delete action
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/course/deleteCourse/${id}`); // Endpoint for deleting
      setData(data.filter((course) => course.id !== id)); // Remove course
    } catch (err) {
      console.error("Error deleting course:", err);
    }
  };

  // Handle field changes in modal form (for editing)
  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setCurrentCourse({
      ...currentCourse,
      [name]: value,
    });
  };

  // Handle updating the course
  const handleUpdateCourse = async () => {
    try {
      await axios.put(
        `http://localhost:4000/course/updateCourse/${currentCourse.id}`,
        currentCourse
      ); // Endpoint for updating
      setData(
        data.map((course) =>
          course.id === currentCourse.id ? currentCourse : course
        )
      ); // Update data with modified course
      setModalIsOpen(false); // Close modal
    } catch (err) {
      console.error("Error updating course:", err);
    }
  };

  // Handle filter value change
  const handleFilterValueChange = (event) => {
    const value = event.target.value;
    setFilterValue(value);

    const filteredData = originalCourse.filter((row) => {
      if (filterType === "name") {
        return row.name.toLowerCase().includes(value.toLowerCase());
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
        return row.name.toLowerCase().includes(filterValue.toLowerCase());
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
        Manage Courses
      </div>
      <div className="px-16 py-4 w-full max-w-4xl">
        <div className="mb-3 text-lg font-semibold flex">
          <Link to = "/addNewCourse">
            <button className="flex">
              Create new course{" "}
              <span className="ml-1 py-1">
                <FaCirclePlus color="green" size={23} />
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
        contentLabel={modalType === "edit" ? "Edit Course" : "View Course"}
      >
        <div className="flex flex-col space-y-4 w-300">
          <h2 className="text-xl font-semibold text-center">
            {modalType === "edit" ? "Edit Course" : "View Course"}
          </h2>
          <div className="flex flex-col">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={currentCourse?.name || ""}
              onChange={handleFieldChange}
              className="border border-gray-300 p-2 rounded-md outline-none"
              disabled={modalType === "view"}
            />
          </div>
          {modalType === "edit" ? (
            <button onClick={handleUpdateCourse}>Update</button>
          ) : (
            <button onClick={() => setModalIsOpen(false)}>Close</button>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ManageCourse;
