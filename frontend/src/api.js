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

export const fetchUsers = async (ownerId) => {
  const url = ownerId 
    ? `${API_URL}/admin/users?owner_id=${ownerId}` 
    : `${API_URL}/admin/users`;
    
  const res = await axios.get(url, { headers: getAuthHeader() });
  return res.data; // return only the array of users
};


// Add a new user
export const addUser = async (userData) => {
  const token = localStorage.getItem("token");
  return await axios.post(`${API_URL}/admin/users`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


// Update existing user
export const updateUser = async (id, userData) => {
  return axios.put(`${API_URL}/admin/users/${id}`, userData, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json", // important!
    },
  });
};


export const deleteUser = (id) => {
  return axios.delete(`${API_URL}/admin/users/${id}`);
};

// Create a new task
export const addTask = async (taskData) => {
  return axios.post(`${API_URL}/tasks`, taskData, { headers: getAuthHeader() });
};

// Fetch tasks for the current admin
export const fetchTasks = async () => {
  const owner_id = localStorage.getItem("userId"); // current admin ID
  return axios.get(`${API_URL}/tasks?owner_id=${owner_id}`, { headers: getAuthHeader() });
};

// Update existing task

export const updateTask = async (taskId, taskData) => {
  return axios.put(`${API_URL}/tasks/${taskId}`, taskData, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
  });
};

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    const res = await axios.delete(`${API_URL}/tasks/${taskId}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting task:", err);
    throw err;
  }
};