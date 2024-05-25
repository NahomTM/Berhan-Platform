import React, { useState } from 'react';
import { FaFacebookF, FaLinkedinIn, FaGoogle } from 'react-icons/fa';
import { MdEmail, MdLock } from 'react-icons/md';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom'; // For navigation

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // For navigation
  const { login } = useAuth();

  const handleSignIn = async (event) => {
    event.preventDefault(); // Prevent default form behavior

    try {
      const response = await axios.post('http://localhost:4000/auth/signIn', {
        email,
        password,
        role,
      });

      const accessToken = response.data.accessToken; // Get token from backend

      if (rememberMe) {
        localStorage.setItem('accessToken', accessToken);
      } else {
        sessionStorage.setItem('accessToken', accessToken);
      }
      
      login();
      navigate('/dashboard'); // Navigate to dashboard on success
    } catch (error) {
      setError(error.response?.data?.message || 'Error signing in');
      console.error('Error:', error.response?.data || error.message);
    }
  };

  return (
    <div className="bg-white flex flex-col items-center justify-center w-full flex-1 px-20 text-center h-screen">
      <div className="bg-white rounded-2xl shadow flex flex-r w-2/3 max-w-2xl">
        <div className="w-96 p-5">
          <div className="text-left font-bold">
            MyApp<span className="text-orange-500">Tech</span>
          </div>
          <div className="py-10">
            <h2 className="text-3xl font-bold text-gray-500 mb-2">Sign In</h2>
            <div className="border-2 w-10 border-gray-900 inline-block mb-2"></div>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <div className="flex flex-col items-center">
              <div className="bg-white w-64 p-1 flex items-center border-2 border-gray-600 rounded-l mb-3">
                <MdEmail className="m-1" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email} // Bind to state
                  onChange={(e) => setEmail(e.target.value)} // Update state
                  className="bg-white outline-none text-sm flex-1"
                />
              </div>

              <div className="bg-white w-64 p-1 flex items-center border-2 border-gray-600 rounded-l mb-3">
                <MdLock className="m-1" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password} // Bind to state
                  onChange={(e) => setPassword(e.target.value)} // Update state
                  className="bg-white outline-none text-sm flex-1"
                />
              </div>

              <div className="bg-white w-64 p-1 flex items-center border-2 border-gray-600 rounded-l mb-3">
                <select
                  name=""
                  value={role} // Bind to state
                  onChange={(e) => setRole(e.target.value)} // Update state
                  className="bg-white outline-none text-sm flex-1"
                >
                  <option value="">Select</option>
                  <option value="Admin">Admin</option>
                  <option value="Instructor">Instructor</option>
                </select>
              </div>

              <div className="flex justify-between w-64 mb-5">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    className="mr-1"
                    checked={rememberMe} // Bind to state
                    onChange={(e) => setRememberMe(e.target.checked)} // Update state
                  />
                  Remember me
                </label>
                <a href="#" className="text-sm">
                  Forgot Password
                </a>
              </div>

              <button
                className="border-2 border-gray-900 rounded-full px-10 py-2 inline-block font-semibold hover:bg-gray-900 hover:text-white"
                onClick={handleSignIn}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
        <div className="w-72 bg-gray-900 text-white rounded-tr-2xl rounded-br-2xl py-36 px-12">
          <h2 className="text-3xl font-bold mb-2">Welcome</h2>
          <div className="border-2 w-10 border-white inline-block mb-2"></div>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam, maiores eius! Nemo quia iure tenetur vel inventore hic fuga voluptatum ducimus.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
