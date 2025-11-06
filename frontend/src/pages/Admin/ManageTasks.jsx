import React, { useState, useEffect } from "react";
import TaskCard from "../../components/TaskCard";
import axios from "axios";

const ManageTasks = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks from backend
  const loadTasks = async () => {
    try {
      const ownerId = localStorage.getItem("userId"); // current admin ID
      const res = await axios.get(`http://127.0.0.1:5000/tasks?owner_id=${ownerId}`);
      setTasks(res.data);
      console.log("Tasks loaded from backend:", res.data);
    } catch (err) {
      console.error("Failed to fetch tasks from backend:", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

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

        <button className="h-9 pl-2 pr-2 mb-2 bg-blue-500 shadow-lg shadow-blue-500/50 rounded-xl text-white text-[17px]">
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
              onStatusToggle={() => handleStatusToggle(task.id)}
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
