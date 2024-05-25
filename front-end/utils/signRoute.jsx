import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const VerifyTokenRoute = () => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            const authUser = localStorage.getItem("accessToken");
            if (!authUser) {
                console.log("No token found");
                setLoading(false);
                return;
            }

            try {
                const res = await axios.post(
                    "http://localhost:4000/access-token/verify-token",
                    { token: authUser }
                );

                if (res.data.message === "success") {
                    console.log("Token verified successfully");
                    setIsAuthorized(true);
                } else {
                    console.error("Token verification failed");
                }
            } catch (error) {
                console.error("Error verifying token:", error);
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, []); // Run only once when the component is mounted

    if (loading) {
        return <div>Loading...</div>; // Show loading indicator while verifying token
    }

    // Conditional navigation after loading is done
    console.log("Is authorized:", isAuthorized);
    return isAuthorized ? <Navigate to="/dashboard" /> : <Navigate to="/" />;
};

export default VerifyTokenRoute;
