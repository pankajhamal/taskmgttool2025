import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { MdOutlineTask } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";

const UserSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all user data
    localStorage.clear();

    // Replace current history entry with login
    navigate("/login", { replace: true });

    // Prevent navigating back to dashboard
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.go(1);
    };
  };

  return (
    <div className="min-w-3xs bg-white overflow-hidden m-3 rounded-2xl shadow-2xl">
      <h2 className="h-9 m-4 mt-6 flex justify-center items-center bg-blue-500 shadow-lg shadow-blue-500/50 rounded-xl text-white text-[17px]">
        User Dashboard
      </h2>

      <div className="flex flex-col justify-center gap-6 mt-10">
        <NavLink
          to="/user/dashboard"
          className={({ isActive }) =>
            `pl-5 flex items-center gap-3 text-[17px] h-10 
            ${isActive ? "bg-blue-100 text-blue-600" : "hover:bg-blue-100"}`
          }
        >
          <RxDashboard className="text-2xl" /> Dashboard
        </NavLink>

        <NavLink
          to="/user/my-tasks"
          className={({ isActive }) =>
            `pl-5 flex items-center gap-3 text-[17px] h-10 
            ${isActive ? "bg-blue-100 text-blue-600" : "hover:bg-blue-100"}`
          }
        >
          <MdOutlineTask className="text-2xl" /> My Task
        </NavLink>

        <button
          onClick={handleLogout}
          className="pl-5 flex items-center gap-3 text-[17px] h-10 text-left hover:bg-blue-100 "
        >
          <IoMdLogOut className="text-2xl" /> Logout
        </button>
      </div>
    </div>
  );
};

export default UserSidebar;
