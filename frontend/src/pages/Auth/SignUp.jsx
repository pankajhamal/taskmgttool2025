import React from "react";
import { useState } from "react";
import { FaTasks } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import OrganizeImage from "../../assets/images/OrganizeImage.png";
import { Password } from "./Password";

const Signup = () => {
  return (
    <div className="w-screen min-h-screen flex justify-center items-center bg-blue-50">
      <div className=" w-300 h-200 flex justify-center items-center shadow-xl/30 rounded-2xl">
        {/* For login form  */}

        <div className="w-full h-200   bg-white p-4 flex rounded-2xl">
          <div className="w-full p-5">
            <div className="flex m-0.5 w-2xs h-3xs">
              <FaTasks className="size-8 mt-[3px] mr-2 text-blue-600" />
              <p className="text-4xl">Tasky</p>
            </div>
            <div className="w-full h-40 flex flex-col  justify-center mt-65">
              <p className="text-4xl">Create an account</p>
              <p className="mt-2 ml-1 text-xl text-[#7F8CAA]">
                Join us today by entering your details below
              </p>

              {/* Form */}
              <form action="">
                {/* Full Name field  */}
                <div className="mt-8">
                  <label className="text-2xl mr-12 block" htmlFor="name">
                    Full Name :{" "}
                  </label>
                  <input
                    type="text"
                    id="full-name"
                    placeholder="Enter the full name"
                    className="border-2 border-solid outline-0 border-blue-400 rounded-xl  w-110 h-14 p-2"
                  />
                </div>
                {/* Email field  */}
                <div className="mt-4">
                  <label className="text-2xl mr-12 block" htmlFor="email">
                    Email :{" "}
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter the email"
                    className="border-2 border-solid outline-0 border-blue-400 rounded-xl  w-110 h-14 p-2"
                  />
                </div>

                {/* Password field  */}
                <Password />

                {/* Admin invite code  */}

                <div className="mt-4">
                  <label className="text-2xl block" htmlFor="password">
                    Admin Code(Optional) :{" "}
                  </label>
                  <input
                    type="text"
                    id="adminCode"
                    placeholder="Enter the admin invite code"
                    className="border-2 border-solid outline-0 border-blue-400 rounded-xl w-110 h-14 p-2"
                  />
                </div>
                <button className="w-100 h-15 bg-blue-600 text-white text-xl mt-8 rounded-2xl">
                  SignUp
                </button>

                <div className="mt-4 ml-2 flex ">
                  <p className=" text-[#7F8CAA] text-xl">
                    Already have an account?{" "}
                  </p>
                  <NavLink
                    to={"/login"}
                    className="text-blue-800 hover:underline text-xl"
                  >
                    Login
                  </NavLink>
                </div>
              </form>
            </div>
          </div>

          {/* For desing  */}
          <div className=" w-full hidden md:flex rounded-xl">
            <img className="w-full rounded-xl" src={OrganizeImage} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
