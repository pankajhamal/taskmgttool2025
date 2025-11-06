import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/Layouts/DashboardLayout.jsx";
import Sidebar from "../../components/Layouts/Sidebar.jsx";
import Navbar from "../../components/Layouts/Navbar.jsx";

const Dashboard = () => {
  const navigate = useNavigate();

  // Redirect to login if not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen min-w-screen flex flex-col bg-blue-50">
      <Navbar />
      <div className="flex flex-1 min-w-screen">
        <Sidebar />
        <div className="w-full m-3 p-2 bg-gray-100 rounded-2xl shadow-2xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
