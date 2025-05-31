import React from "react";
import { useState } from "react";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";

export function Password(){
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div>
      <div className="mt-4">
        <label className="text-2xl block" htmlFor="password">
          Password :{" "}
        </label>
        <div className="flex">
          <input
            type={isPasswordVisible ? "text" : "password"}
            name="password"
            id={isPasswordVisible ? "password-visible" : "password-notvisible"}
            placeholder="Enter the password"
            className="border-2 border-solid outline-0 border-blue-400 rounded-xl w-110 h-14 p-2"
          />

          {isPasswordVisible ? (
            <IoEye
              onClick={togglePasswordVisibility}
              className="size-7 flex absolute ml-100 mt-3 text-gray-500"
            />
          ) : (
            <IoEyeOff
              onClick={togglePasswordVisibility}
              className="size-7 flex absolute ml-100 mt-3 text-gray-500"
            />
          )}

          {/* <IoEyeOff onClick={handleToggle} className="size-7 flex absolute ml-100 mt-3 text-gray-500"/>  */}
        </div>
      </div>
    </div>
  );
};

