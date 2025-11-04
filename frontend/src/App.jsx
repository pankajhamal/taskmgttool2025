import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Admin/Dashboard.jsx";
import Login from "./pages/Auth/Login.jsx";
import SignUp from "./pages/Auth/SignUp.jsx";
import ManageTasks from "./pages/Admin/ManageTasks.jsx";
import CreateTask from "./pages/Admin/CreateTask.jsx";
import ManageUsers from "./pages/Admin/ManageUsers.jsx";

import UserDashboard from "./pages/User/UserDashboard.jsx";
import MyTasks from "./pages/User/MyTasks.jsx";
import ViewTaskDetails from "./pages/User/ViewTaskDetails.jsx";

import PrivateRoute from "./routes/PrivateRoutes.jsx"; // renamed file
import DashboardLayout from "./components/Layouts/DashboardLayout.jsx";
import UserDashboardLayout from "./pages/User/UserDashboardLayout.jsx";

import Unauthorized from "./pages/Unauthorized.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<DashboardLayout />} />
          <Route path="tasks" element={<ManageTasks />} />
          <Route path="create-task" element={<CreateTask />} />
          <Route path="users" element={<ManageUsers />} />
        </Route>

        {/* User Routes */}
        <Route
          path="/user/*"
          element={
            <PrivateRoute allowedRoles={["user"]}>
              <UserDashboard />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<UserDashboardLayout />} />
          <Route path="my-tasks" element={<MyTasks />} />
          <Route path="task-details/:id" element={<ViewTaskDetails />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
