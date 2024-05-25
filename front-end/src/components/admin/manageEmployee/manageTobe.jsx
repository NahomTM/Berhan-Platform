
import React, { useState, useEffect } from "react";
import axios from "axios";
import { CiFilter } from "react-icons/ci";
import { FaEdit, FaEye, FaTrash, FaCirclePlus } from "react-icons/fa";
import Modal from "react-modal";
import DataTable from "react-data-table-component";

// Load DataTable dynamically to avoid server-side rendering issues

// Custom styles for Modal
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

const ManageEmployee = () => {
  // Fetch employee data from backend
  const [employees, setEmployees] = useState([]); // Data for the table
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Handle errors
  const [filterValue, setFilterValue] = useState("");
  const [filterType, setFilterType] = useState("name");

  // Modal state
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // 'view' or 'edit'
  const [currentEmployee, setCurrentEmployee] = useState(null);

  const columns = [
    {
      name: <div className="font-semibold text-lg text-gray-900">Name</div>,
      selector: (row) => `${row.firstName} ${row.middleName || ""}`.trim(),
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div className="flex items-center text-md">
          <span className="mr-2">{`${row.firstName} ${row.middleName || ""}`.trim()}</span>
        </div>
      ),
    },
    {
      name: <div className="font-semibold text-lg text-gray-900">Email</div>,
      selector: (row) => row.email,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div className="flex items-center text-md">
          <span className="mr-2">{row.email}</span>
        </div>
      ),
    },
    {
      name: <div className="font-semibold text-lg text-gray-900">Role</div>,
      selector: (row) => row.role,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div className="flex items-center">
          <span className="mr-2">{row.role}</span>
        </div>
      ),
    },
    {
      name: <div className="font-semibold text-lg text-gray-900">Status</div>,
      selector: (row) => row.status,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div className="flex items-center">
          <span className="mr-2">{row.status}</span>
        </div>
      ),
    },
    {
      name: <div className="font-semibold text-lg text-gray-900">Actions</div>,
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
      center: true
    },
  ];

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:4000/employee/getAllEmployee"); // Your backend endpoint
        setEmployees(response.data); // Set fetched data
        setLoading(false); // Set loading to false when data is ready
      } catch (err) {
        setError(err.message); // Handle errors
        setLoading(false); // Turn off loading in case of error
      }
    };

    fetchEmployees(); // Fetch employee data on component mount
  }, []); // Empty dependency array to fetch data once on component mount

  // Handling view and edit
  const handleView = (employee) => {
    setCurrentEmployee(employee); // Set the current employee to be viewed
    setModalType("view"); // Set modal to view mode
    setModalIsOpen(true); // Open modal
  };

  const handleEdit = (employee) => {
    setCurrentEmployee(employee); // Set the current employee to be edited
    setModalType("edit"); // Set modal to edit mode
    setModalIsOpen(true); // Open modal
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/employee/deleteEmployee/${id}`); // Your backend endpoint for deletion
      const updatedEmployees = employees.filter((e) => e.id !== id); // Remove from state
      setEmployees(updatedEmployees); // Update state
    } catch (err) {
      console.error("Error deleting employee:", err);
    }
  };

  const handleModalClose = () => {
    setModalIsOpen(false);
  };

  const handleUpdateEmployee = async () => {
    try {
      await axios.put(`http://localhost:4000/employee/updateEmployee/${currentEmployee.id}`, currentEmployee); // Update endpoint
      const updatedEmployees = employees.map((e) => (e.id === currentEmployee.id ? currentEmployee : e)); // Update state with new data
      setEmployees(updatedEmployees); // Update state
      setModalIsOpen(false); // Close modal
    } catch (err) {
      console.error("Error updating employee:", err);
    }
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setCurrentEmployee({
      ...currentEmployee,
      [name]: value,
    });
  };

  const handleFilterValueChange = (event) => {
    const value = event.target.value;
    setFilterValue(value);

    const filteredData = employees.filter((row) => {
      if (filterType === "name") {
        return `${row.firstName} ${row.middleName || ""}`.toLowerCase().includes(value.toLowerCase());
      } else if (filterType === "email") {
        return row.email.toLowerCase().includes(value.toLowerCase());
      } else if (filterType === "role") {
        return row.role.toLowerCase().includes(value.toLowerCase());
      } else if (filterType === "status") {
        return row.status.toLowerCase().includes(value.toLowerCase());
      } else {
        return true; // Default to all records
      }
    });

    setEmployees(filteredData); // Update the filtered data
  };

  const handleFilterTypeChange = (event) => {
    const value = event.target.value;
    setFilterType(value);

    const filteredData = employees.filter((row) => {
      if (filterType === "name") {
        return `${row.firstName} ${row.middleName || ""}`.toLowerCase().includes(filterValue.toLowerCase());
      } else if (filterType === "email") {
        return row.email.toLowerCase().includes(filterValue.toLowerCase());
      } else if (filterType === "role") {
        return row.role.toLowerCase().includes(filterValue.toLowerCase());
      } else if (filterType === "status") {
        return row.status.toLowerCase().includes(filterValue.toLowerCase());
      } else {
        return true; // Default to all records
      }
    });

    setEmployees(filteredData); // Update state with filtered data
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error state
  }

  return (
    <div className="justify-center items-center h-screen-minus-18">
      <div className="px-16 py-20 text-lg font-bold text-gray-900">Manage Employee</div>

      <div className="px-16 py-4 max-w-5xl">
        <div className="mb-3 text-lg font-semibold flex text-gray-700 hover:text-gray-900">
          <button className="flex">
            Add new employee
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
            className="appearance-none px-3 py-1/2 items-center border-2 border-gray-900 cursor-pointer rounded-md focus:outline-none ml-2 text-center text-gray-900"
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="role">Role</option>
            <option value="status">Status</option>
          </select>
        </div>

        <div>
          <DataTable
            columns={columns}
            data={employees}
            selectableRows
            fixedHeader
            pagination
          ></DataTable>
        </div>
      </div>

      {/* Modal for viewing and editing */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleModalClose}
        style={customStyles}
        contentLabel={modalType === "edit" ? "Edit Employee" : "View Employee"}
      >
        <h2>{modalType === "edit" ? "Edit Employee" : "View Employee"}</h2>
        <div>
          <label>
            First Name:
            <input
              type="text"
              name="firstName"
              value={currentEmployee?.firstName || ""}
              onChange={handleFieldChange}
              disabled={modalType === "view"}
            />
          </label>
          <label>
            Middle Name:
            <input
              type="text"
              name="middleName"
              value={currentEmployee?.middleName || ""}
              onChange={handleFieldChange}
              disabled={modalType === "view"}
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              name="lastName"
              value={currentEmployee?.lastName || ""}
              onChange={handleFieldChange}
              disabled={modalType === "view"}
            />
          </label>
          <label>
            Gender:
            <select
              name="gender"
              value={currentEmployee?.gender || ""}
              onChange={handleFieldChange}
              disabled={modalType === "view"}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>
            Date of Birth:
            <input
              type="date"
              name="dob"
              value={currentEmployee?.dob || ""}
              onChange={handleFieldChange}
              disabled={modalType === "view"}
            />
          </label>
          <label>
            Role:
            <input
              type="text"
              name="role"
              value={currentEmployee?.role || ""}
              onChange={handleFieldChange}
              disabled={modalType === "view"}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={currentEmployee?.email || ""}
              onChange={handleFieldChange}
              disabled={modalType === "view"}
            />
          </label>
          <label>
            Address:
            <input
              type="text"
              name="address"
              value={currentEmployee?.address || ""}
              onChange={handleFieldChange}
              disabled={modalType === "view"}
            />
          </label>
          <label>
            Phone Number:
            <input
              type="text"
              name="phone"
              value={currentEmployee?.phone || ""}
              onChange={handleFieldChange}
              disabled={modalType === "view"}
            />
          </label>
        </div>
        {modalType === "edit" ? (
          <button onClick={handleUpdateEmployee}>Update</button>
        ) : (
          <button onClick={handleModalClose}>Close</button>
        )}
      </Modal>
    </div>
  );
};

export default ManageEmployee;
