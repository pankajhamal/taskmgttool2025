import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTasks } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import OrganizeImage from "../../assets/images/OrganizeImage.png";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000"; // Flask backend URL

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please enter both username and password");
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}/login`, // Updated endpoint
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const { access_token, role } = res.data; // Updated to match Flask response

      if (!access_token) {
        alert("Login failed");
        return;
      }

      // Save token and role in localStorage
      localStorage.setItem("token", access_token);
      localStorage.setItem("role", role);

      // Redirect based on role
      if (role === "admin") {
        navigate("/admin/manageUser");
      } else {
        navigate("/user/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
      console.error(err);
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
              <p className="text-6xl">Welcome Back!</p>
              <p className="mt-2 ml-1 text-xl text-[#7F8CAA]">
                Please enter your login details below
              </p>

              {/* Login Form */}
              <form onSubmit={handleLogin}>
                <div className="mt-8">
                  <label className="text-2xl mr-12 block" htmlFor="username">
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
                  Login
                </button>

                <div className="mt-4 ml-2 flex">
                  <p className="text-[#7F8CAA] text-xl">
                    Don't have an account?{" "}
                  </p>
                  <NavLink
                    to={"/signup"}
                    className="text-blue-800 hover:underline text-xl"
                  >
                    Sign Up
                  </NavLink>
                </div>
              </form>
            </div>
          </div>

          {/* Design Image */}
          <div className="w-full hidden md:flex rounded-xl">
            <img className="w-full rounded-xl" src={OrganizeImage} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
