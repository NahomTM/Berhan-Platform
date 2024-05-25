import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";

const modalCustomStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    padding: "2rem",
    borderRadius: "0.5rem",
    zIndex: 1000,
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
          onRequestClose={handleModalClose} // Custom close handler
        >
          <h2>Change Username and Password</h2>
          <form onSubmit={handleUpdate}>
            <div className="flex flex-col space-y-4 w-300">
              <div className="flex flex-col mt-3">
                <label>Username:</label>
                <input
                  type="text"
                  placeholder={user?.username || ""}
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md outline-none mt-1"
                />
              </div>
              <div className="flex flex-col">
                <label>Password:</label>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md outline-none mb-3 mt-1"
                />
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                type="submit"
                className="border border-gray-300 px-4 py-2 rounded-md bg-blue-500 text-white"
              >
                Update
              </button>

              <button
                onClick={handleModalClose}
                className="border border-gray-300 px-4 py-2 rounded-md bg-red-500 text-white"
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
