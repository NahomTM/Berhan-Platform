// src/components/UserProfile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:4000/profile/getProfile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        setError(error.response.data.message);
      }
    };

    fetchUserProfile();
  }, []);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.put('http://localhost:4000/profile/updateProfile', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(data);
      setEditMode(false);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div className="mt-20 mx-10 ">
      <h1 className="text-3xl font-bold mt-8 mb-4">User Profile</h1>
      {error && <p className="text-red-500">{error}</p>}
      {user && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
          <div className=" grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
              <input type="text" id="firstName" defaultValue={user.firstName} {...register('firstName', { required: true, pattern: /^[A-Za-z]+$/ })} disabled={!editMode} className="mt-1 p-2 block w-72 border-gray-600 rounded-md border-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              {errors.firstName && <p className="text-red-500">First name is required and can only contain letters</p>}
            </div>
            <div>
              <label htmlFor="middleName" className="block text-sm font-medium text-gray-700 -ml-32">Middle Name</label>
              <input type="text" id="middleName" defaultValue={user.middleName} {...register('middleName', { pattern: /^[A-Za-z]+$/ })} disabled={!editMode} className="mt-1 p-2 -ml-32 block w-72 border-gray-600 border-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              {errors.middleName && <p className="text-red-500">Middle name can only contain letters</p>}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input type="text" id="lastName" defaultValue={user.lastName} {...register('lastName', { required: true, pattern: /^[A-Za-z]+$/ })} disabled={!editMode} className="mt-1 p-2 block w-72 border-gray-600 border-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              {errors.lastName && <p className="text-red-500">Last name is required and can only contain letters</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 -ml-32">Email</label>
              <input type="email" id="email" defaultValue={user.email} {...register('email', { required: true, pattern: /^\S+@\S+$/ })} disabled={!editMode} className="mt-1 -ml-32 p-2 block w-72 border-gray-600 rounded-md border-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              {errors.email && <p className="text-red-500">Invalid email address</p>}
            </div>
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input type="date" id="dob" defaultValue={user.dateOfBirth} {...register('dateOfBirth', { required: true, max: new Date().toISOString().split('T')[0] })} disabled={!editMode} className="mt-1 p-2 block w-72 border-2 border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              {errors.dateOfBirth && <p className="text-red-500">Date of birth is required and cannot be in the future</p>}
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 -ml-32">Phone Number</label>
              <input type="tel" id="phoneNumber" defaultValue={user.phoneNumber} {...register('phoneNumber', { required: true, pattern: /^\+251\d{9}$/ })} disabled={!editMode} className="mt-1 p-2 -ml-32 block w-72 border-gray-600 border-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              {errors.phoneNumber && <p className="text-red-500">Invalid phone number (10 digits only)</p>}
            </div>
           
          </div>
          <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mt-4">Address</label>
              <input type="text" id="address" defaultValue={user.address} {...register('address', { required: true })} disabled={!editMode} className="mt-1 p-2 block w-750 border-gray-600 rounded-md shadow-sm border-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              {errors.address && <p className="text-red-500">Address is required</p>}
         </div>
          {!editMode && (
            <button
              type="button"
              className="mt-4 bg-orange-500 text-white font-bold py-2 px-4 rounded"
              onClick={() => setEditMode(true)}
            >
              Edit
            </button>
          )}
          {editMode && (
            <>
              <button type="submit" className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded">Save</button>
              <button type="button" className="mt-4 ml-2 bg-gray-500 text-white font-bold py-2 px-4 rounded" onClick={() => setEditMode(false)}>Cancel</button>
            </>
          )}
        </form>
      )}
    </div>
  );
};

export default UserProfile;
