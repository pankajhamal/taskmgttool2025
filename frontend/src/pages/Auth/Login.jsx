import React from "react";
import { useState } from "react";
import { FaTasks } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import OrganizeImage from "../../assets/images/OrganizeImage.png";

const Login = () => {
  return (
    <div className="w-screen min-h-screen flex justify-center items-center bg-purple-500">
      <div className=" w-300 h-200 flex justify-center items-center">
        {/* For login form  */}

        <div className="w-full h-200   bg-white p-4 flex rounded-xl">
          <div className="w-full p-5">
            <div className="flex m-0.5 w-2xs h-3xs">
              <FaTasks className="size-8 mt-[3px] mr-2 text-blue-600" />
              <p className="text-4xl">Tasky</p>
            </div>
            <div className="w-full h-40 flex flex-col  justify-center mt-50">
              <p className="text-6xl">Welcome Back!</p>
              <p className="mt-2 ml-1 text-xl text-[#7F8CAA]">
                Please enter your login details below
              </p>

              {/* Form */}
              <form action="">
                {/* Email field  */}
                <div className="mt-8">
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
                <div className="mt-4">
                  <label className="text-2xl block" htmlFor="password">
                    Password :{" "}
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter the password"
                    className="border-2 border-solid outline-0 border-blue-400 rounded-xl w-110 h-14 p-2"
                  />
                </div>
                <button className="w-100 h-15 bg-blue-600 text-white text-xl mt-8 rounded-2xl">
                  Login
                </button>

                <div className="mt-4 ml-2 flex ">
                  <p className=" text-[#7F8CAA] text-xl">
                    Don't have an account?{" "}
                  </p>
                  <NavLink
                    to={"/signup"}
                    className="text-blue-800 hover:underline text-xl"
                  >
                    SignUp
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

export default Login;
