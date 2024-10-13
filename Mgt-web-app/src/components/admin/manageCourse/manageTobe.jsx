"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { CiFilter } from "react-icons/ci";
import { FaEdit, FaEye, FaTrash, FaCirclePlus } from "react-icons/fa";
import dynamic from "next/dynamic";
import Modal from "react-modal";

// Load DataTable dynamically to avoid server-side rendering issues
const DynamicDataTable = dynamic(() => import("react-data-table-component"), {
  ssr: false,
});

// Custom styles for the modal to center it on the screen
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
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

  // Define columns for the data table
  const columns = [
    {
      name: (
        <div className="font-semibold text-lg text-gray-900">Name</div>
      ),
      selector: (row) => row.name,
      sortable: true,
      wrap: true,
    },
    {
      name: (
        <div className="font-semibold text-lg text-gray-900">Instructor</div>
      ),
      selector: (row) => row.instructor,
      sortable: true,
      wrap: true,
    },
    {
      name: (
        <div className="font-semibold text-lg text-gray-900">Actions</div>
      ),
      cell: (row) => (
        <div className="flex">
          <button
            className="px-2"
            onClick={() => handleView(row)}
          >
            <FaEye size={17} />
          </button>
          <button
            className="px-2"
            onClick={() => handleEdit(row)}
          >
            <FaEdit size={17} />
          </button>
          <button
            className="px-2"
            onClick={() => handleDelete(row.id)}
          >
            <FaTrash size={17} />
          </button>
        </div>
      ),
      button: true,
    },
  ];

  // Fetch data from the backend when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/courses"); // Backend endpoint
        setData(response.data); // Set fetched data
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
      await axios.delete(`/api/courses/${id}`); // Endpoint for deleting
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
      await axios.put(`/api/courses/${currentCourse.id}`, currentCourse); // Endpoint for updating
      setData(
        data.map((course) => (course.id === currentCourse.id ? currentCourse : course))
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

    const filteredData = data.filter((row) => {
      if (filterType === "name") {
        return row.name.toLowerCase().includes(value.toLowerCase());
      } else if (filterType === "instructor") {
        return row.instructor.toLowerCase().includes(value.toLowerCase());
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
      } else if (value === "instructor") {
        return row.instructor.toLowerCase().includes(filterValue.toLowerCase());
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
          <button className="flex">
            Create new course{" "}
            <span className="ml-1 py-1">
              <FaCirclePlus color="green" size={23} />
            </span>
          </button>
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
            <option value="instructor">Instructor</option>
          </select>
        </div>

        <div>
          <DynamicDataTable
            columns={columns}
            data={data} // Use fetched data
            selectableRows
            fixedHeader
            pagination
          ></DynamicDataTable>
        </div>
      </div>

      {/* Modal for view and edit */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
        contentLabel={modalType === "edit" ? "Edit Course" : "View Course"}
      >
        <h2>{modalType === "edit" ? "Edit Course" : "View Course"}</h2>
        <div>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={currentCourse?.name || ""}
              onChange={handleFieldChange}
              disabled={modalType === "view"}
            />
          </label>
          <label>
            Instructor:
            <input
              type="text"
              name="instructor"
              value={currentCourse?.instructor || ""}
              onChange={handleFieldChange}
              disabled={modalType === "view"}
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={currentCourse?.description || ""}
              onChange={handleFieldChange}
              disabled={modalType === "view"}
            ></textarea>
          </label>
        </div>
        {modalType === "edit" ? (
          <button onClick={handleUpdateCourse}>Update</button>
        ) : (
          <button onClick={() => setModalIsOpen(false)}>Close</button>
        )}
      </Modal>
    </div>
  );
};

export default ManageCourse;
