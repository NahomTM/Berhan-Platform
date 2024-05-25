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
        <div className="relative flex mt-5 mr-32">
          <span className="relative inset-y-0 left-3 flex items-center">
            <div className={`absolute`}>
              <IoSearchSharp size={20} color="black" />
            </div>
          </span>
          <input
            ref={inputRef}
            type="text"
            placeholder={searchInput}
            className="w-72 h-8 flex rounded shadow outline-none pl-9"
            onClick={handleInputClick}
          />
        </div>
        <div className="mt-5 mr-4 cursor-pointer">
            <IoNotificationsCircleSharp size={28} color="White" />
        </div>
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
