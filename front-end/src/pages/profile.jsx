import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import DefaultProfile from "../resource/defaultProfilePage.svg";
import { MdModeEdit } from "react-icons/md";
import "../style/userProfile.css";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState(null);
  const [profilePicture, setProfilePicture] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
        setProfilePicture(response.data.profilePic || "");
        console.log("proPic: ", profilePicture);
      } catch (error) {
        setError(
          error.response
            ? error.response.data.message
            : "Failed to load profile"
        );
        console.log(error);
      }
    };

    fetchUserProfile();
  }, []);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put("http://localhost:4000/profile/updateProfile", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(data);
      setEditMode(false);
    } catch (error) {
      setError(
        error.response
          ? error.response.data.message
          : "Failed to update profile"
      );
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mt-10 mx-10 w-1000 mb-3">
      <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900">
        User Profile
      </h1>
      {error && <p className="text-red-500">{error}</p>}
      {user && (
        <div className="flex flex-col lg:flex-row bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <div className="flex flex-col items-center lg:w-1/3 relative">
            <div className="profile-picture-container">
              <img
                src={profilePicture || ""}
                alt="Profile"
                className="w-48 h-48 mb-4 object-cover rounded-full"
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
                <h2 className="text-xl font-bold mb-4 text-gray-700">User Information</h2>
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
                      defaultValue={user.firstName}
                      {...register("firstName", {
                        required: true,
                        pattern: /^[A-Za-z]+$/,
                      })}
                      disabled={!editMode}
                      className="mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                    {errors.firstName && (
                      <p className="text-red-500">
                        First name is required and can only contain letters
                      </p>
                    )}
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
                      defaultValue={user.middleName}
                      {...register("middleName", { pattern: /^[A-Za-z]+$/ })}
                      disabled={!editMode}
                      className="mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                    {errors.middleName && (
                      <p className="text-red-500">
                        Middle name can only contain letters
                      </p>
                    )}
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
                      defaultValue={user.lastName}
                      {...register("lastName", {
                        required: true,
                        pattern: /^[A-Za-z]+$/,
                      })}
                      disabled={!editMode}
                      className="mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                    {errors.lastName && (
                      <p className="text-red-500">
                        Last name is required and can only contain letters
                      </p>
                    )}
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
                      defaultValue={user.dateOfBirth}
                      {...register("dateOfBirth", {
                        required: true,
                        max: new Date().toISOString().split("T")[0],
                      })}
                      disabled={!editMode}
                      className="mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                    {errors.dateOfBirth && (
                      <p className="text-red-500">
                        Date of birth is required and cannot be in the future
                      </p>
                    )}
                  </div>
                </div>
                {/* Add Gender field */}
              </div>
              <div>
                <h2 className="text-xl font-bold mb-4 mt-4 text-gray-700">Contact Information</h2>
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
                      defaultValue={user.email}
                      {...register("email", {
                        required: true,
                        pattern: /^\S+@\S+$/,
                      })}
                      disabled={!editMode}
                      className="mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                    {errors.email && (
                      <p className="text-red-500">Invalid email address</p>
                    )}
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
                      defaultValue={user.phoneNumber}
                      {...register("phoneNumber", {
                        required: true,
                        pattern: /^\+251\d{9}$/,
                      })}
                      disabled={!editMode}
                      className="mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-500">
                        Invalid phone number (10 digits only)
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-4 mt-4 text-gray-700">Address</h2>
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
                    defaultValue={user.address}
                    {...register("address", { required: true })}
                    disabled={!editMode}
                    className="mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-700 focus:border-gray-800"
                  />
                  {errors.address && (
                    <p className="text-red-500">Address is required</p>
                  )}
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
