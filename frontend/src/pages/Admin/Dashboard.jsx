import React from "react";
import {Routes, Route} from 'react-router-dom'
import DashboardLayout from "../../components/Layouts/DashboardLayout.jsx";
import Sidebar from "../../components/Layouts/Sidebar.jsx";
import Navbar from "../../components/Layouts/Navbar.jsx";
import ManageTasks from "./ManageTasks.jsx";

import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="min-h-screen min-w-screen flex flex-col bg-blue-50">
      <Navbar />
      <div className="flex flex-1 min-w-screen">
        <Sidebar />
        <div className="w-full bg-white m-3 p-2 rounded-2xl shadow-xl ">
         <Outlet />
        </div>
      </div>
    </div>
  );
};


export default Dashboard;
