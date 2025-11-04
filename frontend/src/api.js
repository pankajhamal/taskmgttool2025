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
  try {
    const response = await axios.post(`${API_URL}/login`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; // should contain access_token and role
  } catch (err) {
    throw err.response?.data || err;
  }
};

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// Get all users
export const fetchUsers = async () => {
  return axios.get(`${API_URL}/users`, { headers: getAuthHeader() });
};

// Add a new user
export const addUser = async (userData) => {
  return axios.post(`${API_URL}/users`, userData, { headers: getAuthHeader() });
};

// Update a user
export const updateUser = async (id, userData) => {
  return axios.put(`${API_URL}/users/${id}`, userData, { headers: getAuthHeader() });
};

// Delete a user
export const deleteUser = async (id) => {
  return axios.delete(`${API_URL}/users/${id}`, { headers: getAuthHeader() });
};