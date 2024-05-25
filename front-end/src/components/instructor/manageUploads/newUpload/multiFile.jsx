"use client"

import React, { useState } from 'react';
import { CiCirclePlus } from "react-icons/ci";
import { IoDocumentText } from "react-icons/io5";

const MultiFileUploader = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [fileTexts, setFileTexts] = useState([]);

  const validateFileType = (file) => {
    const allowedTypes = [".ppt", ".pptx", ".pdf", ".doc", ".docx", ".txt"];
    const fileType = file.name.substring(file.name.lastIndexOf('.'));
    return allowedTypes.includes(fileType);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(validateFileType);
    const newTexts = [];
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        newTexts.push(event.target.result);
        if (newTexts.length === validFiles.length) {
          setFileTexts(prevTexts => [...prevTexts, ...newTexts]);
        }
      };
      reader.readAsText(file);
    });
    setSelectedFiles(validFiles);
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
    const files = Array.from(event.dataTransfer.files);
    const validFiles = files.filter(validateFileType);
    const newTexts = [];
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        newTexts.push(event.target.result);
        if (newTexts.length === validFiles.length) {
          setFileTexts(prevTexts => [...prevTexts, ...newTexts]);
        }
      };
      reader.readAsText(file);
    });
    setSelectedFiles(validFiles);
  };

  const handleUpload = () => {
    // Logic to upload the files goes here
    console.log('Selected files:', selectedFiles);
    console.log('Extracted texts:', fileTexts);
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <label className="text-4xl font-bold mb-6">Upload Documents</label>
      <label className="text-xl font-semibold mb-4">Please upload one or more documents</label>
      <div
        className={`relative bg-gray-200 p-6 rounded-lg ${selectedFiles.length > 0 ? 'h-auto w-600 bg-white border-2 rounded-md' : 'w-600 h-400'} ${isDragging ? 'border-4 border-blue-500' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {selectedFiles.length > 0 ? (
          <div className="grid gap-4">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex px-8 items-center">
                <IoDocumentText size={30}/>
                <span className="text-gray-900 text-left ml-2">{file.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 mt-8">
            <div className='text-gray-500'>
              <CiCirclePlus size={80}/>
            </div>
            
            <span className="text-gray-600">Drag and drop your files here</span>
            <span className="text-gray-500">or</span>
            <label
              htmlFor="file-upload"
              className="cursor-pointer text-blue-500 hover:text-blue-700"
            >
              Browse
            </label>
            <span className="text-gray-500">to choose files</span>
          </div>
        )}
        <input
          type="file"
          id="file-upload"
          accept=".ppt,.pptx,.pdf,.doc,.docx,.txt"
          className="hidden"
          onChange={handleFileChange}
          multiple
        />
      </div>
      <button
        className={`mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${selectedFiles.length > 0 ? '' : 'hidden'}`}
        onClick={handleUpload}
      >
        Upload
      </button>
    </div>
  );
};

export default MultiFileUploader;
