import React, { useState, useEffect, useRef } from "react";
import { IoSearchSharp, IoPersonCircle } from "react-icons/io5";
import { IoNotificationsCircleSharp } from "react-icons/io5";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(true);
  const [searchInput, setSearchInput] = useState("search");
  const inputRef = useRef(null);

  const handleInputClick = () => {
    setIsPlaceholderVisible(false);
    setSearchInput("");
  };

  const handleOutsideClick = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setIsPlaceholderVisible(true);
      setSearchInput("search");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <nav className="bg-[#0f0f0f] flex-1 h-18 justify-between">
      <div className="flex items-center gap-x-5 justify-end">
        <div className="mt-5 mr-28 cursor-pointer">
          <Link to="/manageProfile">
            <button>
              <IoPersonCircle size={28} color="White" />
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
