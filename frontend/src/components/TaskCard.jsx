import React from "react";

// Utility to style priority badge
const getPriorityStyles = (priority) => {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-red-100 text-red-700";
    case "medium":
      return "bg-yellow-100 text-yellow-700";
    case "low":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const TaskCard = ({ task, onStatusToggle }) => {
  const handleToggle = () => {
    onStatusToggle(task.id);
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-5 w-full max-w-2xl mx-auto">
      {/* Top Row: Title & Actions */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h2 className="text-xl font-bold">{task.title}</h2>
          <span
            className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityStyles(
              task.priority
            )}`}
          >
            {task.priority.toUpperCase()}
          </span>
        </div>
        <div className="space-x-2 text-sm">
          <button className="text-blue-500 hover:underline">Edit</button>
          <button className="text-red-500 hover:underline">Delete</button>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-4">{task.description}</p>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <span className="font-semibold">Start Date: </span>
          {task.startDate}
        </div>
        <div>
          <span className="font-semibold">Due Date: </span>
          {task.dueDate}
        </div>
      </div>

      {/* Subtasks */}
      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <span className="font-semibold">Total Tasks: </span>
          {task.totalSubtasks}
        </div>
        <div>
          <span className="font-semibold">Completed Tasks: </span>
          {task.completedSubtasks}
        </div>
      </div>

      {/* Assigned + Status Toggle */}
      <div className="flex justify-between items-center">
        <div className="text-sm">
          <span className="font-semibold">Assigned To: </span>
          {task.assignedTo}
        </div>
        <button
          onClick={handleToggle}
          className={`px-3 py-1 rounded-md text-sm font-semibold shadow ${
            task.completed
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {task.completed ? "Completed" : "Pending"}
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
