import React, { useState, useEffect } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { CiFilter } from "react-icons/ci";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import DataTable from "react-data-table-component";
import Modal from "react-modal";
import axios from "axios";
import "../../../style/modal.css";
import "../../../style/audio.css";

// Define the app element for React Modal
Modal.setAppElement("#root");

const ManageUploads = () => {
  const [examData, setExamData] = useState([]);
  const [originalExam, setOriginalExam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterValue, setFilterValue] = useState("");
  const [filterType, setFilterType] = useState("name");
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [audioSrc, setAudioSrc] = useState(null);

  const columns = [
    {
      name: <div className="font-semibold text-lg text-gray-900">Name</div>,
      selector: (row) => row.fileName,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div className="flex items-center text-md">
          <span className="mr-2">{row.fileName}</span>
        </div>
      ),
    },
    {
      name: <div className="font-semibold text-lg text-gray-900">Audio</div>,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <button
          onClick={() => {
            handleResult(row.id);
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
        <div className="flex px-3">
          <button className="px-2" onClick={() => handleView(row)}>
            <FaEye size={17} />
          </button>
          <button className="px-2" onClick={() => handleDelete(row.id)}>
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
        const response = await axios.get(
          "http://localhost:4000/api/getUploads",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // Include the access token in the Authorization header
            },
          }
        );
        setExamData(response.data);
        setOriginalExam(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message); // Handle error
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterValueChange = (event) => {
    const value = event.target.value;
    setFilterValue(value);

    if (value.trim() === "") {
      // If filter input is cleared, reset to the original dataset
      setExamData(originalExam);
    } else {
      const filteredData = originalExam.filter((row) => {
        if (filterType === "name") {
          return row.fileName.toLowerCase().includes(value.toLowerCase());
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
        return row.fileName.toLowerCase().includes(filterValue.toLowerCase());
      } else {
        return true; // Default to show all records
      }
    });

    setExamData(filteredData); // Update the filtered data
  };

  const handleView = (row) => {
    setSelectedFile(row);
    setModalIsOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const accessToken =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");
      await axios.delete(`http://localhost:4000/api/deleteUpload/${id}`);

      // Update the state to remove the deleted item
      const updatedData = examData.filter((item) => item.id !== id);
      setExamData(updatedData);
      setOriginalExam(updatedData); // Also update the originalExam to keep it in sync
    } catch (error) {
      console.error("There was an error deleting the file!", error);
      setError("There was an error deleting the file."); // Handle error
    }
  };

  const handleResult = async (id) => {
    console.log("Id: ", id);
    const response = await axios.get(
      `http://localhost:4000/api/getAudio/${id}`,
      { responseType: "blob" }
    );

    console.log("response: ", response.data);

    const audioURL = URL.createObjectURL(
      new Blob([response.data], { type: "audio/mp3" })
    );
    setAudioSrc(audioURL);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedFile(null);
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
        Manage Uploads
      </div>
      <div className="px-16 py-4 max-w-3xl">
        <div className="mb-3 text-lg font-semibold flex text-gray-700 hover:text-gray-900">
          <Link to="/newUpload">
            <button className="flex">
              Upload new file
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

        <div className="max-w-5xl">
          <DataTable
            columns={columns}
            data={examData} // Use fetched data
            selectableRows
            pagination
          ></DataTable>
        </div>
        {audioSrc && (
          <div className="mt-4">
            <div className="audio-container">
              <audio controls>
                <source src={audioSrc} type="audio/mp3" />
                Your browser does not support the audio element.
              </audio>
              <button
                className="close-audio-btn"
                onClick={() => setAudioSrc(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="File Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <div>
          <div className="modal-header">
            <button onClick={closeModal}>Close</button>
          </div>
          <div className="modal-body">
            <div>
              {selectedFile && (
                <iframe
                  src={`http://localhost:4000/api/file/${selectedFile.id}`}
                  width="100%"
                  height="500px"
                  title="File Viewer"
                />
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageUploads;
