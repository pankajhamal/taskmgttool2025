import React from "react";
import Dashboard from "./pages/Admin/Dashboard.jsx";
import Login from "./pages/Auth/Login.jsx";
import SignUp from "./pages/Auth/SignUp.jsx";
import ManageTasks from "./pages/Admin/ManageTasks.jsx";
import CreateTask from "./pages/Admin/CreateTask.jsx";
import ManageUsers from "./pages/Admin/ManageUsers.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import UserDashboard from "./pages/User/UserDashboard.jsx";
import MyTasks from "./pages/User/MyTasks.jsx";
import ViewTaskDetails from "./pages/User/ViewTaskDetails.jsx";

import PrivateRoute from "./routes/PrivateRoute.jsx";
import DashboardLayout from "./components/Layouts/DashboardLayout.jsx";
import UserDashboardLayout from "./pages/User/UserDashboardLayout.jsx"

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signUp" element={<SignUp />}></Route>

          {/* Admin Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<Dashboard />}>
              <Route path="/admin/dashboard" element={<DashboardLayout />}></Route>
              <Route path="/admin/tasks" element={<ManageTasks />}></Route>
              <Route path="/admin/create-task" element={<CreateTask />}></Route>
              <Route path="/admin/users" element={<ManageUsers />}></Route>
            </Route>
            
          </Route>

          {/* User Routes */}
          <Route element={<PrivateRoute allowedRoles={["user"]} />}>
            <Route path="/user" element={<UserDashboard />}>
            <Route path="/user/dashboard" element={<UserDashboardLayout />}></Route>
            <Route path="/user/my-tasks" element={<MyTasks />}></Route>
            </Route>
            <Route
              path="/user/task-details/:id"
              element={<ViewTaskDetails />}
            ></Route>
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
