import React, { useState, useEffect } from "react";
import TaskCard from "../../components/TaskCard";
import { fetchUserTasks, updateTaskStatus } from "../../api.js";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const MyTasks = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const username = localStorage.getItem("username");

  // Fetch tasks from backend
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchUserTasks(username);
        setTasks(data);
      } catch (err) {
        console.error("Error loading tasks:", err);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, [username]);

  // Filter tasks by tab
  const getFilteredTasks = () => {
    if (activeTab === "pending") return tasks.filter((t) => t.status === "pending");
    if (activeTab === "completed") return tasks.filter((t) => t.status === "completed");
    return tasks;
  };

  // Callback to update a task's status in state
const handleTaskUpdate = async (taskId, newStatus) => {
  try {
    // Users cannot revert completed → pending
    const task = tasks.find((t) => t.id === taskId);
    if (task.status === "completed" && newStatus === "pending") {
      alert("You cannot change a completed task back to pending.");
      return;
    }

    // Call backend to update
    await updateTaskStatus(taskId, newStatus);

    // Update local state immediately
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  } catch (err) {
    console.error("Failed to update status:", err);
    alert("Failed to update task status.");
  }
};


  //------------- Download Report ----------------
  const handleDownloadReport = () => {
    if (tasks.length === 0) {
      alert("No tasks available to export!");
      return;
    }

    const formattedData = tasks.map((task, index) => {
      let assignedNames = [];

      if (task.assigned_to) {
        if (Array.isArray(task.assigned_to)) {
          assignedNames = task.assigned_to.map((a) => (a.name ? a.name : a));
        } else if (typeof task.assigned_to === "string") {
          try {
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

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks Report");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, `User_Tasks_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
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
          All Task <span>{tasks.length}</span>
        </button>

        <button
          onClick={() => setActiveTab("pending")}
          className={`${activeTab === "pending" ? "text-blue-600" : "hover:text-blue-600"}`}
        >
          Pending <span>{tasks.filter((task) => task.status === "pending").length}</span>
        </button>

        <button
          onClick={() => setActiveTab("completed")}
          className={`${activeTab === "completed" ? "text-blue-600" : "hover:text-blue-600"}`}
        >
          Completed <span>{tasks.filter((task) => task.status === "completed").length}</span>
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
        {getFilteredTasks().map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onTaskUpdate={handleTaskUpdate}
            onDelete={() =>
              setTasks((prev) => prev.filter((t) => t.id !== task.id))
            }
            isUser={true}
            isAdmin={false}
          />
        ))}
      </div>
    </div>
  );
};

export default MyTasks;
