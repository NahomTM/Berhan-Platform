import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminDashboard from "../components/admin/page";
import InstructorDashboard from "../components/instructor/page";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null); // Store the user role

  useEffect(() => {
    const localToken = localStorage.getItem("accessToken");
    const sessionToken = sessionStorage.getItem("accessToken");
    const accessToken = localToken || sessionToken;

    if (accessToken) {
      axios
        .post("http://localhost:4000/auth/verify-role", { token: accessToken })
        .then((res) => {
          const userRole = res.data.role; // Get the role
          setRole(userRole); // Set the role
        })
        .catch((error) => {
          console.error("Error verifying role:", error);
        })
        .finally(() => {
          setLoading(false); // Set loading to false after data is fetched
        });
    } else {
      setLoading(false); // No token, set loading to false
    }
  }, []); // Empty dependency array to ensure the effect only runs once on component mount

  if (loading) {
    return <div>Loading...</div>;
  }

  // Render based on role
  return (
    <div>
      {role === "admin" && <AdminDashboard />} 
      {role === "instructor" && <InstructorDashboard />} 
      {role === null && <div>Unauthorized Access</div>} 
    </div>
  );
}
