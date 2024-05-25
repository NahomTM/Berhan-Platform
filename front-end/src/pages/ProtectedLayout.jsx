import React from "react";
import Sidebar from "../layout/sidebar";
import Navbar from "../layout/navbar";

const ProtectedLayout = ({ children, onLogout }) => (
  <div className="flex h-screen">
    <Sidebar onLogout={onLogout} />
    <div className="flex-grow">
      <Navbar />
      <div className=" overflow-y-auto h-screen-minus-18">
        {children}
      </div>
    </div>
  </div>
);

export default ProtectedLayout;
