import React, { useState } from "react";
import { X, Users } from "lucide-react";
import { updateTaskStatus } from "../api.js";
import axios from "axios";

// Utility to style priority badge
const getPriorityStyles = (priority) => {
  switch ((priority || "").toLowerCase()) {
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

const TaskCard = ({ task, membersList = [], onTaskUpdate, onDelete }) => {
  const [editingTask, setEditingTask] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  const role = localStorage.getItem("role"); // "admin" or "user"

  const mappedMembersList = membersList.map((u) => ({
    id: u.id,
    name: u.username,
  }));

  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editDueDate, setEditDueDate] = useState(task.due_date);

  const [editAssignedMembers, setEditAssignedMembers] = useState(() => {
    if (!task.assigned_to) return [];
    let membersArray = [];
    if (typeof task.assigned_to === "string") {
      membersArray = task.assigned_to
        .replace(/[\[\]']+/g, "")
        .split(",")
        .map((name, idx) => ({
          id: `tmp-${idx}`,
          name: name.trim(),
        }));
    } else if (Array.isArray(task.assigned_to)) {
      membersArray = task.assigned_to.map((name, idx) => ({
        id: `tmp-${idx}`,
        name: name,
      }));
    }
    return membersArray;
  });

  const handleOpenMemberModal = () => setIsMemberModalOpen(true);
  const handleCloseMemberModal = () => setIsMemberModalOpen(false);

  const handleAssignMember = (memberToToggle) => {
    setEditAssignedMembers((prevMembers) => {
      const isAssigned = prevMembers.some(
        (member) => member.name === memberToToggle.name
      );
      if (isAssigned) {
        return prevMembers.filter((m) => m.name !== memberToToggle.name);
      } else {
        return [...prevMembers, memberToToggle];
      }
    });
  };

  const handleRemoveAssignedMember = (memberId) => {
    setEditAssignedMembers((prev) =>
      prev.filter((member) => member.id !== memberId)
    );
  };

  const handleSaveChanges = async () => {
    try {
      const payload = {
        title: editTitle,
        description: editDescription,
        priority: editPriority,
        due_date: editDueDate,
        assignedTo: editAssignedMembers.map((m) => m.name),
      };

      await axios.put(`http://127.0.0.1:5000/tasks/${task.id}`, payload);

      if (onTaskUpdate) {
        onTaskUpdate(task.id, payload);
      }

      setEditingTask(false);
    } catch (err) {
      console.error("Failed to update task:", err);
      alert("Failed to update task. Check console for details.");
    }
  };

  const MemberSelectionModal = ({
    isOpen,
    onClose,
    membersList,
    assignedMembers,
    onAssignMember,
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 backdrop-blur-xs bg-opacity-40 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md mx-4 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-semibold mb-4">Assign Members</h2>
          <div className="max-h-64 overflow-y-auto pr-2">
            {membersList.length > 0 ? (
              <ul className="space-y-2">
                {membersList.map((member) => (
                  <li
                    key={member.id}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                    onClick={() => onAssignMember(member)}
                  >
                    <span className="text-gray-800">{member.name}</span>
                    {assignedMembers.some((m) => m.name === member.name) ? (
                      <span className="text-green-600 font-medium text-sm">
                        Assigned
                      </span>
                    ) : (
                      <span className="text-blue-500 font-medium text-sm">Add</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No members available.</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="mt-6 w-full bg-blue-500 text-white h-10 rounded-md hover:bg-blue-600 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      onClick={() => {
        if (role === "admin") setEditingTask(true); // only admin opens edit modal
      }}
      className="bg-white shadow-md rounded-xl cursor-pointer p-5 w-full max-w-2xl mx-auto mb-4"
    >
      {/* Task Header */}
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-xl font-bold">{task.title}</h2>
        <div className="flex gap-2">
          <span
            className={`mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityStyles(
              task.priority
            )}`}
          >
            {(task.priority || "").toUpperCase()}
          </span>

          {/* Status badge */}
          {/* Status badge */}
<span
  onClick={async (e) => {
    e.stopPropagation(); // prevent card click
    if (role !== "user") return; // only users can toggle status

    const newStatus = task.status === "pending" ? "completed" : "pending";

    try {
      // Call API
      await updateTaskStatus(task.id, newStatus);

      // Notify parent to update its state
      if (onTaskUpdate) {
        onTaskUpdate(task.id, newStatus);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  }}
  className={`mt-1 px-2 py-0.5 text-xs font-medium rounded-full cursor-pointer ${
    task.status === "completed"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
  }`}
>
  {task.status === "completed" ? "Completed" : "Pending"}
</span>

        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-4">{task.description}</p>

      {/* Due Date */}
      <div className="text-sm mb-2">
        <span className="font-semibold">Due Date: </span>
        {task.due_date || "No due date"}
      </div>

      {/* Assigned Members */}
      <div className="text-sm mb-4">
        <span className="font-semibold">Assigned To: </span>
        {editAssignedMembers.length > 0
          ? editAssignedMembers.map((m) => m.name).join(", ")
          : "No one assigned"}
      </div>


      {/* Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-xl relative w-full max-w-md p-6"
          >
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h1 className="font-semibold text-2xl text-gray-800">Edit Task</h1>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingTask(false);
                  }}
                  className="cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Form Fields */}
              <div>
                <h2 className="text-gray-700 text-lg mb-1">Task Title</h2>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="outline-none border-2 border-gray-300 h-10 p-3 w-full rounded-md focus:border-blue-500 transition-colors"
                />

                <h2 className="text-gray-700 text-lg mb-1 mt-4">Description</h2>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="outline-none border-2 border-gray-300 h-32 p-3 w-full rounded-md resize-y focus:border-blue-500 transition-colors"
                />

                <h2 className="text-gray-700 text-lg mb-1 mt-4">Priority</h2>
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                  className="pl-3 h-10 border-2 border-gray-300 outline-none w-full rounded-md focus:border-blue-500 transition-colors"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>

                <h2 className="text-gray-700 text-lg mb-1 mt-4">Due Date</h2>
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  className="pl-3 h-10 border-2 border-gray-300 outline-none w-full rounded-md focus:border-blue-500 transition-colors"
                />

                <h2 className="text-gray-700 text-lg mb-1 mt-4">Assign Members</h2>
                <div
                  onClick={handleOpenMemberModal}
                  className="flex gap-2 justify-center items-center pl-3 pr-3 h-10 rounded-md bg-gray-200 text-gray-700 cursor-pointer hover:text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  <Users className="text-xl" /> Add Members
                </div>

                {editAssignedMembers.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {editAssignedMembers.map((member) => (
                      <span
                        key={member.id}
                        className="flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                      >
                        {member.name}
                        <button
                          type="button"
                          onClick={() => handleRemoveAssignedMember(member.id)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Save & Delete Buttons */}
              <div className="flex items-center justify-around gap-2 mt-4">
                <button
                  onClick={() => {
                    onDelete(task.id);
                    setEditingTask(false);
                  }}
                  type="button"
                  className="w-full bg-red-600 h-12 text-white rounded-md font-semibold text-lg hover:bg-red-700 transition-colors shadow-md"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  className="w-full bg-indigo-600 h-12 text-white rounded-md font-semibold text-lg hover:bg-indigo-700 transition-colors shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>

            {/* Member Modal */}
            <MemberSelectionModal
              isOpen={isMemberModalOpen}
              onClose={handleCloseMemberModal}
              membersList={mappedMembersList}
              assignedMembers={editAssignedMembers}
              onAssignMember={handleAssignMember}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
