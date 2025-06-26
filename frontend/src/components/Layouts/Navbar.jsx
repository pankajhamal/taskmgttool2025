import React from "react";
import { FaTasks } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="h-15 w-full flex justify-between items-center bg-white  shadow-xl">
      <div className="flex ml-7">
        <FaTasks className="size-7 mt-[3px] mr-2 text-blue-600 " />
        <p className="text-3xl">Tasky</p>
      </div>
      <div className="flex items-center mr-7 ">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold bg-blue-600 flex-shrink-0 mr-4`}
        >
          PH
        </div>
        <div>
          <p>Pankaj hamal</p>
          <span>Admin</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
