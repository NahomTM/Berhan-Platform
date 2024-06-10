import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import DefaultProfile from "../resource/defaultProfilePage.svg";
import { MdModeEdit } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../style/userProfile.css";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState("");

  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          "http://localhost:4000/profile/getProfile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data);
        setProfilePicturePreview(response.data.profilePic || null); // Set to null initially
        // Prefill form data
        Object.keys(response.data).forEach((key) => {
          setValue(key, response.data[key]);
        });

        console.log("profile pic: ", profilePicturePreview);
      } catch (error) {
        toast.error(
          error.response
            ? error.response.data.message
            : "Failed to load profile"
        );
      }
    };

    fetchUserProfile();
  }, [setValue]);

  const validateFormData = (data) => {
    const errors = {};

    if (!data.firstName || !/^[A-Za-z]+$/.test(data.firstName)) {
      errors.firstName = "First name is required and can only contain letters";
    }
    if (data.middleName && !/^[A-Za-z]+$/.test(data.middleName)) {
      errors.middleName = "Middle name can only contain letters";
    }
    if (!data.lastName || !/^[A-Za-z]+$/.test(data.lastName)) {
      errors.lastName = "Last name is required and can only contain letters";
    }
    if (!data.dateOfBirth || new Date(data.dateOfBirth) > new Date()) {
      errors.dateOfBirth =
        "Date of birth is required and cannot be in the future";
    }
    if (!data.email || !/^\S+@\S+$/.test(data.email)) {
      errors.email = "Invalid email address";
    }
    if (!data.phoneNumber || !/^\+251\d{9}$/.test(data.phoneNumber)) {
      errors.phoneNumber =
        "Invalid phone number (use +251 followed by 9 digits)";
    }
    if (!data.address) {
      errors.address = "Address is required";
    }

    return errors;
  };

  const onSubmit = async (data) => {
    const validationErrors = validateFormData(data);

    if (Object.keys(validationErrors).length > 0) {
      Object.values(validationErrors).forEach((error) => {
        toast.error(error);
      });
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();
      Object.keys(data).forEach((key) => formData.append(key, data[key]));
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      await axios.put("http://localhost:4000/profile/updateProfile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setUser(data);
      setEditMode(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(
        error.response
          ? error.response.data.message
          : "Failed to update profile"
      );
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setProfilePicturePreview(URL.createObjectURL(file)); // Use URL.createObjectURL to create a preview URL
    }
  };

  return (
    <div className="mt-10 mx-10 w-1000 mb-3">
      <ToastContainer />
      <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900">
        User Profile
      </h1>
      {user && (
        <div className="flex flex-col lg:flex-row bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <div className="flex flex-col items-center lg:w-1/3 relative">
            <div className="profile-picture-container">
              <img
                src={profilePicturePreview || DefaultProfile} // Use profilePicturePreview instead of profilePicture
                alt="Profile"
                className="w-48 h-48 mb-4 object-cover rounded-full border-2"
              />
              {editMode && (
                <label className="profile-picture-overlay flex">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="profile-picture-input"
                  />
                  <span className="edit-icon">
                    <MdModeEdit size={20} />
                  </span>
                </label>
              )}
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="lg:w-2/3 lg:ml-8">
            <div className="flex-col">
              <div>
                <h2 className="text-xl font-bold mb-4 text-gray-700">
                  User Information
                </h2>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="flex flex-col">
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      {...register("firstName")}
                      disabled={!editMode}
                      className="mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="middleName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Middle Name
                    </label>
                    <input
                      type="text"
                      id="middleName"
                      {...register("middleName")}
                      disabled={!editMode}
                      className="mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      {...register("lastName")}
                      disabled={!editMode}
                      className="mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="dateOfBirth"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      {...register("dateOfBirth")}
                      disabled={!editMode}
                      className="mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-4 mt-4 text-gray-700">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="flex flex-col">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register("email")}
                      disabled={!editMode}
                      className="mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      {...register("phoneNumber")}
                      disabled={!editMode}
                      className="mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-4 mt-4 text-gray-700">
                  Address
                </h2>
                <div className="flex flex-col">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    {...register("address")}
                    disabled={!editMode}
                    className="mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-700 focus:border-gray-800"
                  />
                </div>
              </div>
            </div>
            {!editMode && (
              <button
                type="button"
                className="mt-6 bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-600 transition duration-200"
                onClick={() => setEditMode(true)}
              >
                Edit
              </button>
            )}
            {editMode && (
              <div className="flex mt-6">
                <button
                  type="submit"
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="ml-2 bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600 transition duration-200"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
