import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTasks } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import OrganizeImage from "../../assets/images/OrganizeImage.png";
import { signup } from "../../api";

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // new email state
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!username || !email || !password)
      return alert("Enter username, email, and password");

    const res = await signup({ username, email, password }); // include email
    if (res.error) {
      alert(res.error);
    } else {
      alert(res.message || "Signup successful!");
      navigate("/login");
    }
  };

  return (
    <div className="w-screen min-h-screen flex justify-center items-center bg-blue-50">
      <div className="w-300 h-200 flex justify-center items-center shadow-xl/30 rounded-2xl">
        <div className="w-full h-200 bg-white p-4 flex rounded-2xl">
          <div className="w-full p-5">
            <div className="flex m-0.5 w-2xs h-3xs">
              <FaTasks className="size-8 mt-[3px] mr-2 text-blue-600" />
              <p className="text-4xl">Tasky</p>
            </div>
            <div className="w-full h-40 flex flex-col justify-center mt-50">
              <p className="text-6xl">Sign Up</p>
              <p className="mt-2 ml-1 text-xl text-[#7F8CAA]">
                Please enter your signup details below
              </p>
              <form onSubmit={handleSignup}>
                {/* Username */}
                <div className="mt-8">
                  <label className="text-2xl block mb-1" htmlFor="username">
                    Username:
                  </label>
                  <input
                    type="text"
                    id="username"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border-2 border-solid outline-0 border-blue-400 rounded-xl w-110 h-14 p-2"
                    required
                  />
                </div>

                {/* Email */}
                <div className="mt-4">
                  <label className="text-2xl block mb-1" htmlFor="email">
                    Email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-2 border-solid outline-0 border-blue-400 rounded-xl w-110 h-14 p-2"
                    required
                  />
                </div>

                {/* Password */}
                <div className="mt-4">
                  <label className="text-2xl block mb-1" htmlFor="password">
                    Password:
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-2 border-solid outline-0 border-blue-400 rounded-xl w-110 h-14 p-2"
                    required
                  />
                </div>

                <button className="w-100 h-15 bg-blue-600 text-white text-xl mt-8 rounded-2xl">
                  Sign Up
                </button>

                <div className="mt-4 ml-2 flex">
                  <p className="text-[#7F8CAA] text-xl mr-2">
                    Already have an account?
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
          <div className="w-full hidden md:flex rounded-xl">
            <img className="w-full rounded-xl" src={OrganizeImage} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
