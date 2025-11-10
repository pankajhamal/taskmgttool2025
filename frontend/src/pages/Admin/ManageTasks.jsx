import React, { useState, useEffect } from "react";
import TaskCard from "../../components/TaskCard";
import axios from "axios";
import { fetchUsers, deleteTask, updateTask } from "../../api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


const API_URL = "http://127.0.0.1:5000"; // Flask backend URL

const ManageTasks = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [tasks, setTasks] = useState([]);
  const [availableMembers, setAvailableMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [membersList, setMembersList] = useState([]);

 const loadData = async () => {
  try {
    const ownerId = localStorage.getItem("userId"); // current admin ID

    // Fetch tasks
    const tasksRes = await axios.get(`http://127.0.0.1:5000/tasks?owner_id=${ownerId}`);
    setTasks(tasksRes.data);
    console.log("Tasks loaded from backend:", tasksRes.data);
    
  } catch (err) {
    console.error("Failed to fetch data from backend:", err);
    setTasks([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadData();
  }, []);

  // Fetch users (filter by role = 'user') for current admin
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const owner_id = localStorage.getItem("userId");
        const res = await axios.get(`${API_URL}/admin/users?owner_id=${owner_id}`);
        // Only include users
        const users = res.data.filter(u => u.role === "user");
        setMembersList(users);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

  
const handleTaskUpdate = (taskId, updatedTask) => {
  setTasks(prevTasks =>
    prevTasks.map(t => (t.id === taskId ? { ...t, ...updatedTask } : t))
  );
};

// Update task handler
const handleSaveEdit = async (updatedTaskData) => {
  try {
    const payload = {
      ...updatedTaskData,
      assignedTo: assignedMembers, // pass array of names
    };

    await updateTask(editingTask.id, payload);

    // Update local tasks state
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === editingTask.id ? { ...t, ...payload } : t
      )
    );

    setEditModalOpen(false);
    setEditingTask(null);
    alert("Task updated successfully!");
  } catch (error) {
    console.error("Failed to update task:", error);
    alert("Failed to update task!");
  }
};


// Delete task handler

const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
      alert("Task deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete task.");
    }
  };


  const getFilteredTasks = () => {
    if (activeTab === "pending") return tasks.filter((t) => t.status !== "done");
    if (activeTab === "completed") return tasks.filter((t) => t.status === "done");
    return tasks;
  };

  const handleStatusToggle = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === "done" ? "pending" : "done";

    try {
      await axios.put(`http://127.0.0.1:5000/tasks/${taskId}`, { status: newStatus });
      setTasks(prev =>
        prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
      );
    } catch (err) {
      console.error("Failed to update task status:", err);
    }
  };

  // Function to download Excel report
 const handleDownloadReport = () => {
  if (tasks.length === 0) {
    alert("No tasks available to export!");
    return;
  }

  // Prepare worksheet data
  const formattedData = tasks.map((task, index) => {
    let assignedNames = [];

    if (task.assigned_to) {
      if (Array.isArray(task.assigned_to)) {
        // Array of objects or strings
        assignedNames = task.assigned_to.map((a) => (a.name ? a.name : a));
      } else if (typeof task.assigned_to === "string") {
        try {
          // Convert string like "['pankaj1']" to array
          assignedNames = JSON.parse(task.assigned_to.replace(/'/g, '"'));
        } catch (err) {
          assignedNames = [task.assigned_to];
        }
      }
    }

    return {
      "S.N.": index + 1,
      "Title": task.title,
      "Description": task.description,
      "Status": task.status,
      "Priority": task.priority || "N/A",
      "Assigned To": assignedNames.join(", "),
      "Due Date": task.due_date || "N/A",
    };
  });

  // Create a worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  // Create a workbook and add the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks Report");

  // Generate Excel file and trigger download
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

  saveAs(blob, `Tasks_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
};



  if (loading) return <p className="p-5 text-gray-700">Loading tasks...</p>;

  return (
    <div className="flex flex-col p-5 gap-5 bg-gray-100 h-190 overflow-auto">
      <div>
        <h1 className="text-2xl font-bold">Manage Tasks</h1>
      </div>

      {/* Tab Buttons */}
      <div className="flex justify-end gap-10 border-b-2 text-xl text-gray-600 h-10">
        <button
          onClick={() => setActiveTab("all")}
          className={`${activeTab === "all" ? "text-blue-600" : "hover:text-blue-600"}`}
        >
          All Task <span>{tasks.length}</span>
        </button>

        <button
          onClick={() => setActiveTab("pending")}
          className={`${activeTab === "pending" ? "text-blue-600" : "hover:text-blue-600"}`}
        >
          Pending <span>{tasks.filter(t => t.status !== "done").length}</span>
        </button>

        <button
          onClick={() => setActiveTab("completed")}
          className={`${activeTab === "completed" ? "text-blue-600" : "hover:text-blue-600"}`}
        >
          Completed <span>{tasks.filter(t => t.status === "done").length}</span>
        </button>

        <button 
        onClick={handleDownloadReport}
        className="h-9 pl-2 pr-2 mb-2 bg-blue-500 shadow-lg shadow-blue-500/50 rounded-xl text-white text-[17px]">
          Download Report
        </button>
      </div>

      {/* Task Cards */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {getFilteredTasks().length > 0 ? (
          getFilteredTasks().map(task => (
            <TaskCard
              key={task.id}
              task={task}
              membersList={membersList}  // pass fetched users here
              onStatusToggle={() => handleStatusToggle(task.id)}
              onTaskUpdate={handleTaskUpdate} 
              onDelete= {() => handleDelete(task.id)}
              onSaveEdit={(updatedData) => handleSaveEdit(task.id, updatedData)} 
              isAdmin={true}
              isUser={false}
            />
          ))
        ) : (
          <p className="text-gray-600">No tasks available.</p>
        )}
      </div>
    </div>
  );
};

export default ManageTasks;
