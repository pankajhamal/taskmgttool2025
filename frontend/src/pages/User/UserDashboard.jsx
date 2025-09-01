import React from 'react'
import {Routes, Route, Outlet} from 'react-router-dom'
import UserNavbar from "../../components/Layouts/UserNavbar.jsx";
import UserSidebar from '../../components/Layouts/UserSidebar.jsx';

const UserDashboard = () => {
  return (
    <div>
      <UserNavbar />
      <div className="flex flex-1 min-w-screen">
        <UserSidebar />
        <div className="w-full m-3 p-2 bg-gray-100 rounded-2xl shadow-2xl">
         <Outlet />
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
