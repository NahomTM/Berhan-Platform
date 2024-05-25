import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for authentication
const AuthContext = createContext();

// A custom hook to use the AuthContext easily
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check for access token in both storages
    const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (accessToken) {
      setIsLoggedIn(true)
    }
   // Set state based on token presence
  }, []); // Run once on mount

  const login = () => {
    setIsLoggedIn(true); // Update the state when logging in
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    setIsLoggedIn(false); // Update the state when logging out
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
