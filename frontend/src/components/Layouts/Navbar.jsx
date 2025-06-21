import React from 'react'
import { FaTasks } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className='h-15 w-full flex justify-between items-center bg-white  shadow-xl'>
     <div className='flex ml-7'>
        <FaTasks className="size-7 mt-[3px] mr-2 text-blue-600 " />
        <p className="text-3xl">Tasky</p>
     </div>
     <div className='items-center mr-7'>
        <p>Pankaj hamal</p>
        <span>Admin</span>
     </div>
    </div>
  )
}

export default Navbar
