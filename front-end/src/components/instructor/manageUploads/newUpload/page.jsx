import React, { useState } from "react";
import axios from "axios";
import { CiCirclePlus } from "react-icons/ci";
import { IoDocumentText } from "react-icons/io5";
import InputFileUpload from "../../../../icons/upload";
const DocumentUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileText, setFileText] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [fileName, setFileName] = useState("");

  const validateFileType = (file) => {
    const allowedTypes = [".ppt", ".pptx", ".pdf", ".doc", ".docx", ".txt"];
    const fileType = file.name.substring(file.name.lastIndexOf("."));
    return allowedTypes.includes(fileType);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (validateFileType(file)) {
      setSelectedFile(file);
      setFileName(file.name);
    } else {
      setSelectedFile(null);
      setFileText("");
      alert(
        "Invalid file type! Please upload .ppt, .pptx, .pdf, .doc, .docx, or .txt."
      );
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (validateFileType(file)) {
      setSelectedFile(file);
      setFileName(file.name)
    } else {
      setSelectedFile(null);
      setFileText("");
      alert("Invalid file type!");
    }
  };


  const handleUpload = async (e) => {
    e.preventDefault();
    console.log(fileText);
    const accessToken = localStorage.getItem("accessToken")||sessionStorage.getItem("accessToken"); // Retrieve the access token from local storage
    if (!accessToken) {
      alert("Access token is required to upload a file.");
      return;
    }

    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("documentTitle", fileName)

    try {
      // Send the file text to the backend for rewriting
      // const rewriteResponse = await axios.post('/api/rewrite', { text: fileText });
      // const rewrittenText = rewriteResponse.data.rewrittenText;
      // setRewritten(rewrittenText);

      // // Send the rewritten text to the backend for TTS synthesis

      const response = await axios.post(
        "http://localhost:4000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`, // Include the access token in the Authorization header
          },
        }
      );
      setAudioUrl(response.data.audioUrl); // Store the audio URL
      console.log(audioUrl);
      console.log("File uploaded successfully:", response.data);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file.");
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <label className="text-4xl font-bold mb-6">Upload a Document</label>
      <label className="text-xl font-semibold mb-4">
        Upload one document at a time
      </label>
      <div
        className={`relative bg-gray-200 p-6 rounded-lg ${
          selectedFile
            ? "h-100 w-600 bg-white border-2 rounded-md"
            : "w-600 h-400"
        } ${isDragging ? "border-4 border-blue-500" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {selectedFile ? (
          <div className="flex px-8 items-center">
            <IoDocumentText size={30} />
            <span className="text-gray-900">{selectedFile.name}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 mt-8">
            <CiCirclePlus size={80} />
            <span className="text-gray-600">Drag and drop your file here</span>
            <span className="text-gray-500">or</span>
            <label
              htmlFor="file-upload"
              className="cursor-pointer text-blue-500 hover:text-blue-700"
            >
              Browse
            </label>
            <input
              type="file"
              id="file-upload"
              accept=".ppt,.pptx,.pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}
      </div>
      {selectedFile && (
        <div className="mt-3">
          <InputFileUpload
            onClick={handleUpload} // Attach the upload logic
          />
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;
