import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { PiExam, PiStudentBold, PiUploadSimpleBold } from "react-icons/pi";
import ActionAreaCard from "../../icons/card";
import InstLineChart from "../../icons/lineCharts";
import AlignItemsList from "../../icons/list";

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

const InstructorDashboard = () => {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [myStudents, setMyStudents] = useState(0);
  const [myExams, setMyExams] = useState(0);
  const [myUploads, setMyUploads] = useState(0);
  const [newItems, setNewItems] = useState([]);

  const fetchSpecStuds = async () => {
    try {
      const accessToken =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");
      const response = await axios.get(
        "http://localhost:4000/room/getSpecStud",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const rooms = response.data;

      // Create a Set to store unique user IDs
      const uniqueUserIds = new Set(rooms.map((room) => room.user.id));
      setMyStudents(uniqueUserIds.size);
      const examResponse = await axios.get(
        "http://localhost:4000/exam/getLineExam",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the access token in the Authorization header
          },
        }
      );
      const exams = examResponse.data;

      const examNumbers = new Set(
        exams.map((exam) => {
          exam.examId;
        })
      );

      setMyExams(examNumbers.size);

      const uploadResponse = await axios.get(
        "http://localhost:4000/api/getUploads",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the access token in the Authorization header
          },
        }
      );

      const uploads = uploadResponse.data;

      const uploadNumbers = new Set(uploads.map((upload) => upload.id));

      setMyUploads(uploadNumbers.size);
      const today = new Date();
      const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      const recentExams = examResponse.data.filter(
        (exam) => new Date(exam.createdAt) >= sevenDaysAgo
      );
      const recentUploads = uploadResponse.data.filter(
        (upload) => new Date(upload.createdAt) >= sevenDaysAgo
      );

      const newItemsData = [
        ...recentExams.map((exam) => ({
          type: "exam",
          title: "New exam added",
          description: `${exam.examName} added on ${formatDate(
            exam.createdAt
          )}`,
        })),
        ...recentUploads.map((upload) => ({
          type: "upload",
          title: "New material uploaded",
          description: `${upload.fileName} added on ${formatDate(
            upload.createdAt
          )}`,
        })),
      ];
      setNewItems(newItemsData);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

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
        if (
          !userInfo.data.passChanged &&
          !sessionStorage.getItem("modalDismissed")
        ) {
          setShowModal(true);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchSpecStuds();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (user) {
      try {
        await axios.put(`http://localhost:4000/changeTemp/user/${user.id}`, {
          username: newUsername || user.username,
          password: newPassword || user.password,
          passChanged: true,
        });

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

  const cardData = [
    {
      title: "Students",
      description: `Total number of students: ${myStudents}`,
      icon: <PiStudentBold size={70} />,
    },
    {
      title: "Uploads",
      description: `Total number of uploads: ${myUploads}`,
      icon: <PiUploadSimpleBold size={70} />,
    },
    {
      title: "Exams",
      description: `Total number of exam created: ${myExams}`,
      icon: <PiExam size={70} />,
    },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };

  return (
    <div>
      <div className="text-2xl ml-10 mt-20 font-bold">
        <h1>Welcome to Dashboard</h1>
      </div>
      <div className="flex-col">
        <div className="text-xl ml-10 mt-10 font-semibold">
          <h1>Overview</h1>
        </div>
        <div className="h-300 ml-5 px-5 py-8">
          <div style={{ display: "flex", gap: "20px" }}>
            {cardData.map((card, index) => (
              <div className="w-320 cursor-pointer" key={index}>
                <ActionAreaCard
                  title={card.title}
                  description={card.description}
                  icon={card.icon}
                />
              </div>
            ))}
          </div>
          <div className="mt-8 border-t-2 border-gray-500 items-center w-1030">
            <hr />
          </div>
          <div className="flex">
            <div className="mt-10 w-600">
              <div className="text-md font-semibold text-gray-700 ml-6 mb-3">
                <h1>Exams' and Uploads' Statistical Analysis</h1>
              </div>
              <InstLineChart />
            </div>
            <div className="mt-10 ml-14 bg-white shadow-lg rounded-lg py-4 h-380 w-370 overflow-y-auto ">
              <div className="ml-5 font-bold text-gray-700">
                <h1>Recent Activities</h1>
              </div>
              {newItems.map((item, index) => (
                <div key={index}>
                  <AlignItemsList
                    title={item.title}
                    description={item.description}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
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
                <label className="text-gray-700 font-semibold">Username:</label>
                <input
                  type="text"
                  placeholder={user?.username || ""}
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="border border-gray-300 p-3 rounded-md outline-none mt-1 focus:ring-2 focus:ring-orange-500 transition duration-200"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700 font-semibold">Password:</label>
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

export default InstructorDashboard;
