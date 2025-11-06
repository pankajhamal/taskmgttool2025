import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { MdOutlineTask, MdOutlineAddBox } from "react-icons/md";
import { BsPeople } from "react-icons/bs";
import { IoMdLogOut } from "react-icons/io";

const Sidebar = () => {
  const navigate = useNavigate();

 
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login", { replace: true }); // prevents back button access
  };
  
  return (
    <div className="min-w-3xs bg-white overflow-hidden m-3 rounded-2xl shadow-2xl">
      <h2 className="h-9 m-4 mt-6 flex justify-center items-center bg-blue-500 shadow-lg shadow-blue-500/50 rounded-xl text-white text-[17px]">
        Admin Dashboard
      </h2>
      <div className="flex flex-col justify-center gap-6 mt-10">
        <NavLink
          to={"/admin/dashboard"}
          className={({ isActive }) =>
            `pl-5 flex items-center gap-3 text-[17px] h-10 ${
              isActive ? "bg-blue-100 text-blue-600" : " hover:bg-blue-100"
            }`
          }
        >
          <RxDashboard className="text-2xl" /> Dashboard
        </NavLink>

        <NavLink
          to={"/admin/tasks"}
          className={({ isActive }) =>
            `pl-5 flex items-center gap-3 text-[17px] h-10 ${
              isActive ? "bg-blue-100 text-blue-600" : " hover:bg-blue-100"
            }`
          }
        >
          <MdOutlineTask className="text-2xl" /> Manage Task
        </NavLink>

        <NavLink
          to={"/admin/create-task"}
          className={({ isActive }) =>
            `pl-5 flex items-center gap-3 text-[17px] h-10 ${
              isActive ? "bg-blue-100 text-blue-600" : " hover:bg-blue-100"
            }`
          }
        >
          <MdOutlineAddBox className="text-2xl" />
          Create Task
        </NavLink>

        <NavLink
          to={"/admin/users"}
          className={({ isActive }) =>
            `pl-5 flex items-center gap-3 text-[17px] h-10 ${
              isActive ? "bg-blue-100 text-blue-600" : " hover:bg-blue-100"
            }`
          }
        >
          <BsPeople className="text-2xl" />
          Team Members
        </NavLink>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="pl-5 flex items-center gap-3 text-[17px] h-10 w-full text-left hover:bg-blue-100"
        >
          <IoMdLogOut className="text-2xl" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
