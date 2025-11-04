import axios from 'axios';

const API_URL = "http://127.0.0.1:5000";

export const signup = async (userData) => {
  return await axios.post(`${API_URL}/signup`, userData, {
    headers: {
      "Content-Type": "application/json", // required for preflight
    },
    withCredentials: true, // optional, only if using cookies/auth headers
  });
};

export const login = async (userData) => {
  return await axios.post(`${API_URL}/login`, userData, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};
