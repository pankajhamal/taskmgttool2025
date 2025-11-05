import React, { useState, useEffect } from "react";
import { X, Users } from 'lucide-react';
import axios from "axios";

const API_URL = "http://127.0.0.1:5000"; // Flask backend URL

// MemberSelectionModal Component
const MemberSelectionModal = ({ isOpen, onClose, membersList, assignedMembers, onAssignMember }) => {
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
                  <span className="text-gray-800">{member.username}</span>
                  {assignedMembers.some(m => m.id === member.id) ? (
                    <span className="text-green-600 font-medium text-sm">Assigned</span>
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

const CreateTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");
  const [assignedMembers, setAssignedMembers] = useState([]);
  const [membersList, setMembersList] = useState([]);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

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

  const handleAssignMember = (memberToToggle) => {
    setAssignedMembers(prevMembers => {
      const isAssigned = prevMembers.some(m => m.id === memberToToggle.id);
      if (isAssigned) {
        return prevMembers.filter(m => m.id !== memberToToggle.id);
      } else {
        return [...prevMembers, memberToToggle];
      }
    });
  };

  const handleRemoveAssignedMember = (memberId) => {
    setAssignedMembers(prevMembers => prevMembers.filter(m => m.id !== memberId));
  };

  const handleCreateTask = () => {
    if (!title.trim()) {
      alert("Task title is required");
      return;
    }

    const task = {
      title,
      description,
      priority,
      dueDate,
      assignedMembers,
      owner_id: localStorage.getItem("userId")
    };

    console.log("Task created:", task);
    alert("Task created successfully!");

    // Reset form
    setTitle("");
    setDescription("");
    setPriority("Low");
    setDueDate("");
    setAssignedMembers([]);
  };

  return (
    <div className="p-5 h-180 overflow-auto w-full max-w-3xl bg-white rounded-2xl mx-auto my-4 shadow-lg">
      <h1 className="font-semibold text-2xl text-gray-800 mb-4">Create Task</h1>

      <div className="flex flex-col gap-4">
        <div>
          <label className="text-gray-700 text-lg mb-1">Task Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="outline-none border-2 border-gray-300 h-10 p-3 w-full rounded-md focus:border-blue-500 transition-colors"
            placeholder="Enter task title"
          />
        </div>

        <div>
          <label className="text-gray-700 text-lg mb-1">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="outline-none border-2 border-gray-300 h-32 p-3 w-full rounded-md resize-y focus:border-blue-500 transition-colors"
            placeholder="Enter task description"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-gray-700 text-lg mb-1">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                className="pl-3 h-10 border-2 border-gray-300 outline-none w-full rounded-md focus:border-blue-500 transition-colors"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="text-gray-700 text-lg mb-1">Assign to</label>
              <div
                onClick={() => setIsMemberModalOpen(true)}
                className="flex gap-2 justify-center items-center pl-3 pr-3 h-10 rounded-md bg-gray-200 text-gray-700 cursor-pointer hover:text-blue-600 hover:bg-blue-100 transition-colors"
              >
                <Users className="text-xl" /> Add members
              </div>
              {assignedMembers.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {assignedMembers.map(m => (
                    <span
                      key={m.id}
                      className="flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                    >
                      {m.username}
                      <button
                        type="button"
                        onClick={() => handleRemoveAssignedMember(m.id)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-gray-700 text-lg mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="pl-3 h-10 border-2 border-gray-300 outline-none w-full rounded-md focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleCreateTask}
          className="w-full bg-indigo-600 h-12 text-white rounded-md font-semibold text-lg hover:bg-indigo-700 transition-colors shadow-md mt-4"
        >
          Create Task
        </button>
      </div>

      <MemberSelectionModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        membersList={membersList}
        assignedMembers={assignedMembers}
        onAssignMember={handleAssignMember}
      />
    </div>
  );
};

export default CreateTask;
