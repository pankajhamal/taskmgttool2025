import React, { useState, useEffect } from "react";
import TaskCard from "../../components/TaskCard";
import { fetchUserTasks, updateTaskStatus } from "../../api.js"; // <-- API helper

const MyTasks = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId"); // current logged-in user

  // Fetch tasks from backend
useEffect(() => {
  const loadTasks = async () => {
    try {
      const username = localStorage.getItem("username"); // logged-in user
      const data = await fetchUserTasks(username);
      setTasks(data);
    } catch (err) {
      console.error("Error loading tasks:", err);
      setTasks([]);
    } finally {
      setLoading(false); // ✅ important
    }
  };
  loadTasks();
}, []);




  const getFilteredTasks = () => {
    if (activeTab === "pending") return tasks.filter((t) => t.status === "pending");
    if (activeTab === "completed") return tasks.filter((t) => t.status === "completed");
    return tasks;
  };

  // Toggle status between pending <-> completed
  const handleStatusToggle = async (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === "completed" ? "pending" : "completed";

    try {
      // Update backend
      await updateTaskStatus(taskId, { status: newStatus });

      // Update frontend state
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      console.error("Failed to update task status:", err);
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Loading tasks...</p>;
  }

  return (
    <div className="flex flex-col p-5 gap-5 bg-gray-100 h-190 overflow-auto">
      <div>
        <h1 className="text-2xl font-bold">Manage Task</h1>
      </div>

      {/* Tab Buttons */}
      <div className="flex justify-end gap-10 border-b-2 text-xl text-gray-600 h-10">
        <button
          onClick={() => setActiveTab("all")}
          className={`${activeTab === "all" ? "text-blue-600" : "hover:text-blue-600"}`}
        >
          <p>
            All Task <span>{tasks.length}</span>
          </p>
        </button>

        <button
          onClick={() => setActiveTab("pending")}
          className={`${activeTab === "pending" ? "text-blue-600" : "hover:text-blue-600"}`}
        >
          <p>
            Pending <span>{tasks.filter((task) => task.status === "pending").length}</span>
          </p>
        </button>

        <button
          onClick={() => setActiveTab("completed")}
          className={`${activeTab === "completed" ? "text-blue-600" : "hover:text-blue-600"}`}
        >
          <p>
            Completed <span>{tasks.filter((task) => task.status === "completed").length}</span>
          </p>
        </button>

        <button className="h-9 pl-2 pr-2 mb-2 bg-blue-500 shadow-lg shadow-blue-500/50 rounded-xl text-white text-[17px]">
          Download Report
        </button>
      </div>

      {/* Task Cards */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {getFilteredTasks().map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusToggle={() => handleStatusToggle(task.id)}
            isUser={true}
            isAdmin={false}
          />
        ))}
      </div>
    </div>
  );
};

export default MyTasks;
