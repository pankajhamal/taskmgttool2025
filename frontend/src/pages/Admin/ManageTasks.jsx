import React, { useState, useEffect } from "react";
import TaskCard from "../../components/TaskCard";
import axios from "axios";
import { deleteTask, updateTask } from "../../api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API_URL = "http://127.0.0.1:5000"; // Flask backend URL

const ManageTasks = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [tasks, setTasks] = useState([]);
  const [membersList, setMembersList] = useState([]);
  const [loading, setLoading] = useState(true);

  const ownerId = localStorage.getItem("userId"); // current admin ID

  // Fetch tasks from backend
  const loadTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks?owner_id=${ownerId}`);
      setTasks(res.data);
      console.log("Tasks loaded:", res.data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users (role = "user") for current admin
  const loadUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/users?owner_id=${ownerId}`);
      const users = res.data.filter(u => u.role === "user");
      setMembersList(users);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  useEffect(() => {
    loadTasks();
    loadUsers();
  }, []);

  // Filter tasks by tab
  const getFilteredTasks = () => {
    if (activeTab === "pending") return tasks.filter(t => t.status === "pending");
    if (activeTab === "completed") return tasks.filter(t => t.status === "completed");
    return tasks;
  };

  // Toggle task status
  const handleStatusToggle = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === "completed" ? "pending" : "completed";

    try {
      await axios.put(`${API_URL}/tasks/${taskId}`, { status: newStatus });
      setTasks(prev =>
        prev.map(t => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      console.error("Failed to update task status:", err);
    }
  };

  // Update task locally
 const handleTaskUpdate = (taskId, updatedData) => {
  setTasks(prev =>
    prev.map(t =>
      t.id === taskId
        ? { ...t, ...(typeof updatedData === "string" ? { status: updatedData } : updatedData) }
        : t
    )
  );
};


  // Delete task
  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      alert("Task deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete task.");
    }
  };

  // Download Excel report
  const handleDownloadReport = () => {
    if (tasks.length === 0) {
      alert("No tasks available to export!");
      return;
    }

    const formattedData = tasks.map((task, index) => {
      let assignedNames = [];

      if (task.assigned_to) {
        if (Array.isArray(task.assigned_to)) {
          assignedNames = task.assigned_to.map(a => (a.name ? a.name : a));
        } else if (typeof task.assigned_to === "string") {
          try {
            assignedNames = JSON.parse(task.assigned_to.replace(/'/g, '"'));
          } catch {
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

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks Report");

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
          Pending <span>{tasks.filter(t => t.status === "pending").length}</span>
        </button>

        <button
          onClick={() => setActiveTab("completed")}
          className={`${activeTab === "completed" ? "text-blue-600" : "hover:text-blue-600"}`}
        >
          Completed <span>{tasks.filter(t => t.status === "completed").length}</span>
        </button>

        <button
          onClick={handleDownloadReport}
          className="h-9 pl-2 pr-2 mb-2 bg-blue-500 shadow-lg shadow-blue-500/50 rounded-xl text-white text-[17px]"
        >
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
              membersList={membersList}
              onStatusToggle={() => handleStatusToggle(task.id)}
              onTaskUpdate={handleTaskUpdate}
              onDelete={() => handleDelete(task.id)}
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
