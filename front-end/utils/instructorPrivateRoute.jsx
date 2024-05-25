import { Outlet, Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

const InstructorPrivateRoute = () => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    const authUser = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

    useEffect(() => {
        if (authUser) {
            console.log("Verifying role with token:", authUser);
            axios
                .post("http://localhost:4000/auth/verify-role", { token: authUser })
                .then((res) => {
                    console.log("Role verification response:", res.data); // Check response
                    if (res.data.role === "instructor") {
                        setIsAuthorized(true); // Update authorization
                    }
                })
                .catch((error) => {
                    console.error("Error verifying role:", error); // Error handling
                })
                .finally(() => {
                    setLoading(false); // Loading state is complete
                });
        } else {
            setLoading(false); // No token, stop loading
        }
    }, [authUser]);

    console.log("Loading:", loading, "Authorized:", isAuthorized); // Debug current state

    if (loading) {
        return <div>Loading...</div>; // Loading indicator while waiting for response
    }

    return isAuthorized ? <Outlet /> : <Navigate to="/dashboard" />; // Conditional rendering based on authorization
};

export default InstructorPrivateRoute;
