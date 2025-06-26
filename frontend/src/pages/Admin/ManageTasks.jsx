import React, { useState } from "react";
import TaskCard from "../../components/TaskCard";

const initialTasks = [
  {
    id: 1,
    title: "Design Website",
    description: "Design a responsive marketing website for product launch.",
    startDate: "2025-06-25",
    dueDate: "2025-07-05",
    totalSubtasks: 5,
    completedSubtasks: 2,
    assignedTo: "Pankaj Hamal",
    completed: false,
    priority: "High",
  },
  {
    id: 2,
    title: "API Integration",
    description: "Connect frontend to Flask backend.",
    startDate: "2025-06-20",
    dueDate: "2025-07-01",
    totalSubtasks: 3,
    completedSubtasks: 3,
    assignedTo: "Kshitiz Rawal",
    completed: true,
    priority: "Medium",
  },
  {
    id: 2,
    title: "API Integration",
    description: "Connect frontend to Flask backend.",
    startDate: "2025-06-20",
    dueDate: "2025-07-01",
    totalSubtasks: 3,
    completedSubtasks: 3,
    assignedTo: "Piyus Rawal",
    completed: true,
    priority: "Medium",
  },
  {
    id: 2,
    title: "API Integration",
    description: "Connect frontend to Flask backend.",
    startDate: "2025-06-20",
    dueDate: "2025-07-01",
    totalSubtasks: 3,
    completedSubtasks: 3,
    assignedTo: "Diya Bogati",
    completed: true,
    priority: "Medium",
  },
];

const ManageTasks = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [tasks, setTasks] = useState(initialTasks);

  const getFilteredTasks = () => {
    if (activeTab === "pending") return tasks.filter((t) => !t.completed);
    if (activeTab === "completed") return tasks.filter((t) => t.completed);
    return tasks;
  };

  const handleStatusToggle = (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="flex flex-col p-5 gap-5 bg-gray-100 min-h-full">
      <div>
        <h1 className="text-2xl font-bold">Manage Task</h1>
      </div>

      {/* Tab Buttons */}
      <div className="flex justify-end gap-10 border-b-2 text-xl text-gray-600 h-10">
        <button
          onClick={() => setActiveTab("all")}
          className={`${
            activeTab === "all" ? "text-blue-600" : "hover:text-blue-600"
          }`}
        >
          <p>
            All Task <span>{tasks.length}</span>
          </p>
        </button>

        <button
          onClick={() => setActiveTab("pending")}
          className={`${
            activeTab === "pending" ? "text-blue-600" : "hover:text-blue-600"
          }`}
        >
          <p>
            Pending{" "}
            <span>{tasks.filter((task) => !task.completed).length}</span>
          </p>
        </button>

        <button
          onClick={() => setActiveTab("completed")}
          className={`${
            activeTab === "completed" ? "text-blue-600" : "hover:text-blue-600"
          }`}
        >
          <p>
            Completed{" "}
            <span>{tasks.filter((task) => task.completed).length}</span>
          </p>
        </button>

        <button className="h-9 pl-2 pr-2 mb-2 bg-blue-500 shadow-lg shadow-blue-500/50 rounded-xl text-white text-[17px] ">
          Download Report
        </button>
      </div>

      {/* Task Cards */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {getFilteredTasks().map((task) => (
          <TaskCard key={task.id} task={task} onStatusToggle={handleStatusToggle} />
        ))}
      </div>
    </div>
  );
};

export default ManageTasks;
