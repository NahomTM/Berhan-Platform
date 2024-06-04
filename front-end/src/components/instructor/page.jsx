import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";

const modalCustomStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#ffffff",
    border: "none",
    borderRadius: "10px",
    padding: "20px",
    width: "400px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const fetchUserData = async () => {
    const accessToken =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("Access token not found");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/changeTemp/verifyToken",
        { token: accessToken }
      );
      if (response.data.valid) {
        const userId = response.data.decoded.id;
        const userInfo = await axios.get(
          `http://localhost:4000/changeTemp/user/${userId}`
        );
        setUser(userInfo.data);

        // Show modal if passChanged is false and sessionStorage doesn't indicate dismissal
        if (!userInfo.data.passChanged && !sessionStorage.getItem("modalDismissed")) {
          setShowModal(true);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData(); // Fetch user data when the component mounts
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (user) {
      try {
        await axios.put(
          `http://localhost:4000/changeTemp/user/${user.id}`,
          {
            username: newUsername || user.username,
            password: newPassword || user.password,
            passChanged: true,
          }
        );

        // After updating, reset the modal dismissal flag and close the modal
        sessionStorage.removeItem("modalDismissed");
        setShowModal(false);
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
  };

  const handleModalClose = () => {
    // Set a flag in sessionStorage when the modal is dismissed without updating
    sessionStorage.setItem("modalDismissed", "true");
    setShowModal(false);
  };

  return (
    <div className="flex justify-center items-center h-screen-minus-18">
      <h1>Hello Instructor</h1>
      {showModal && (
          <Modal
            style={modalCustomStyles}
            isOpen={showModal}
            onRequestClose={handleModalClose}
          >
            <h2 className="text-gray-800 mb-6 text-md">
              Change Username and Password
            </h2>
            <form onSubmit={handleUpdate}>
              <div className="flex flex-col space-y-6">
                <div className="flex flex-col">
                  <label className="text-gray-700 font-semibold">
                    Username:
                  </label>
                  <input
                    type="text"
                    placeholder={user?.username || ""}
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="border border-gray-300 p-3 rounded-md outline-none mt-1 focus:ring-2 focus:ring-orange-500 transition duration-200"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-700 font-semibold">
                    Password:
                  </label>
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border border-gray-300 p-3 rounded-md outline-none mt-1 focus:ring-2 focus:ring-orange-500 transition duration-200"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center mt-6">
                <button
                  type="submit"
                  className="px-6 py-2 rounded-md bg-orange-500 text-white font-semibold hover:bg-orange-600 transition duration-200"
                >
                  Update
                </button>
                <button
                  onClick={handleModalClose}
                  className="px-6 py-2 rounded-md bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400 transition duration-200"
                >
                  Close
                </button>
              </div>
            </form>
          </Modal>
        )}
    </div>
  );
};

export default AdminDashboard;
