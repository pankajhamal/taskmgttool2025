// src/pages/Unauthorized.jsx
import React from "react";
import { NavLink } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
      <p className="text-2xl mb-6">You do not have permission to access this page.</p>
      <NavLink
        to="/login"
        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
      >
        Go to Login
      </NavLink>
    </div>
  );
};

export default Unauthorized;
