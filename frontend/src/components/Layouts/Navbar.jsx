import React, { useEffect, useState } from "react";
import { FaTasks } from "react-icons/fa";
import { fetchAdmin } from "../../api"; // Make sure api.js has fetchAdmin

const Navbar = () => {
  const [adminName, setAdminName] = useState("");

useEffect(() => {
  const getAdmin = async () => {
    try {
      const data = await fetchAdmin();
      console.log("Data in Navbar:", data); // <-- add this
      setAdminName(data.name); // make sure this is data.name
    } catch (err) {
      console.error("Error fetching admin:", err);
    }
  };
  getAdmin();
}, []);


  // Function to get two initials
  const getInitials = (name) => {
    if (!name) return "??";
    const words = name.split(" ");
    const initials = (words[0]?.[0] || "") + (words[1]?.[0] || "");
    return initials.toUpperCase();
  };

  return (
    <div className="h-15 w-full flex justify-between items-center bg-white shadow-xl">
      <div className="flex ml-7">
        <FaTasks className="size-7 mt-[3px] mr-2 text-blue-600 " />
        <p className="text-3xl">Tasky</p>
      </div>
      <div className="flex items-center mr-7 ">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold bg-blue-600 flex-shrink-0 mr-4">
          {getInitials(adminName)}
        </div>
        <div>
          <p>{adminName || "Loading..."}</p>
          <span>Admin</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
