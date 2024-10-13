import React, { useState, useEffect } from "react";
import { RiMenuFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { ImExit } from "react-icons/im";
import { adminMenuData, instructorMenuData } from "../components/menu/Menu";
import CustomizedSwitches from "../icons/themeMode";

const Sidebar = ({ onLogout }) => {
  const [open, setOpen] = useState(true);
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const localToken = localStorage.getItem("accessToken"); // Get the token from local storage
    const sessionToken = sessionStorage.getItem("accessToken"); // Get the token from session storage
    const accessToken = localToken || sessionToken; // Use whichever token is found

    if (accessToken) {
      axios
        .post("http://localhost:4000/auth/verify-role", { token: accessToken }) // Verify the token
        .then((res) => {
          const role = res.data.role;

          if (role === "admin") {
            setMenuData(adminMenuData);
          } else if (role === "instructor") {
            setMenuData(instructorMenuData);
          }
        })
        .catch((error) => {
          console.error("Error verifying role:", error); // Handle errors properly
        })
        .finally(() => {
          setLoading(false); // Set loading to false after verification
        });
    } else {
      setLoading(false); // No token, set loading to false
    }
  }, []);
  // Run only once on mount

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleExitClick = () => {
    logout(); // Clear authentication context
    navigate("/"); // Redirect to the sign-in page
  };
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div
      className={`bg-[#0f0f0f] flex flex-col min-h-screen max-h-screen overflow:hidden ${
        open ? "w-72" : "w-20"
      } duration-500 text-gray-100 px-4`}
    >
      <div className="mt-3 py-3 px-2 flex justify">
        <div>
          <RiMenuFill
            size={26}
            className="mt-0.5 cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <div
          className={`${
            open
              ? "px-5 duration-500"
              : "duration-500 delay-200 overflow-hidden"
          } px-8 text-2xl`}
        >
          Clarus
          <span
            className={`${
              open ? "duration-500" : "duration-500 delay-200 overflow-hidden"
            } text-2xl text-orange-400`}
          >
            EDU
          </span>
        </div>
      </div>
      <div
        className={`${
          open ? "mt-1 border-t-1 border-gray-600 w-64 items-center" : "hidden"
        }`}
      >
        <hr />
      </div>
      <div className="mt-8 flex flex-col gap-4 relative">
        {menuData?.map((menu, i) => (
          <Link
            to={menu.url} // Updated property name from 'link' to 'url'
            key={i}
            className={`${
              menu?.margin && "mt-5"
            } group flex items-center text-base gap-2 py-4 px-2 font-bold hover:bg-gray-700 rounded-md`}
          >
            <div>{React.createElement(menu.icon, { size: "20" })}</div>
            <h2
              style={{
                transitionDelay: `${i + 1}00ms`,
              }}
              className={`px-5 whitespace-pre duration-500 ${
                !open && "opacity-0 translate-x-28 overflow-hidden"
              }`}
            >
              {menu.label}
            </h2>
            <h2
              className={`${
                open && "hidden"
              } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
            >
              {menu.label}
            </h2>
          </Link>
        ))}
      </div>
      <div
        className={`${
          open ? "mt-auto flex items-center pb-10 ml-3" : "mt-auto pb-10 flex"
        }`}
      >
        {/* <CustomizedSwitches/> Theme mode switch */}
        <ImExit
          onClick={handleExitClick}
          size={26}
          className="text-white cursor-pointer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
        <h2
          className={`flex ml-2 transition-opacity duration-300 font-semibold ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: isHovered ? "100ms" : "0ms" }}
        >
          Log Out
        </h2>
      </div>
    </div>
  );
};

export default Sidebar;
