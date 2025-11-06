import React, { useState } from "react";
import { X, Users, Plus, Trash2 } from "lucide-react"; // Using lucide-react for all icons

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

//Dummy data later update from database

const availableMembers = [
  { id: "m1", name: "Alice Smith" },
  { id: "m2", name: "Bob Johnson" },
  { id: "m3", name: "Charlie Brown" },
  { id: "m4", name: "Diana Prince" },
  { id: "m5", name: "Eve Adams" },
];

const TaskCard = ({ task }) => {
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [assignedMembers, setAssignedMembers] = useState([]);

  const handleOpenMemberModal = () => {
    setIsMemberModalOpen(true);
  };

  const handleCloseMemberModal = () => {
    setIsMemberModalOpen(false);
  };

  const handleAssignMember = (memberToToggle) => {
    setAssignedMembers((prevMembers) => {
      // Check if the member is already assigned
      const isAssigned = prevMembers.some(
        (member) => member.id === memberToToggle.id
      );

      if (isAssigned) {
        // Remove member if already assigned
        return prevMembers.filter((member) => member.id !== memberToToggle.id);
      } else {
        // Add member if not assigned
        return [...prevMembers, memberToToggle];
      }
    });
  };

  const handleRemoveAssignedMember = (memberId) => {
    setAssignedMembers((prevMembers) =>
      prevMembers.filter((member) => member.id !== memberId)
    );
  };

  //Show the  editing Task card
  const [editingTask, setEditingTask] = useState(false);

  // MemberSelectionModal Component
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
                    {assignedMembers.some((m) => m.id === member.id) ? (
                      <span className="text-green-600 font-medium text-sm">
                        Assigned
                      </span>
                    ) : (
                      <span className="text-blue-500 font-medium text-sm">
                        Add
                      </span>
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
      onClick={() => setEditingTask(true)}
      className="bg-white shadow-md rounded-xl cursor-pointer p-5 w-full max-w-2xl mx-auto"
    >
      {/* Top Row: Title & Actions */}
      <div className="flex justify-between items-start mb-3">
        <div className=" w-full flex items-center justify-between">
          <h2 className="text-xl font-bold">{task.title}</h2>
          <span
            className={` mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityStyles(
              task.priority
            )}`}
          >
            {task.priority.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-4">{task.description}</p>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <span className="font-semibold">Due Date: </span>
          {task.due_date}
        </div>
      </div>

      {/* Assigned to */}
      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
  <div>
    <span className="font-semibold">Assigned To: </span>
    <span className="text-gray-700">
      {task.assigned_to
        ? task.assigned_to.replace(/[\[\]']+/g, "")  // remove brackets and single quotes
        : "No one assigned"
      }
    </span>
  </div>
</div>

      

      {/* Assigned + Status Toggle */}
      <div className="flex justify-between items-center">
        <button
          className={`px-3 py-1 rounded-md text-sm font-semibold shadow ${
            task.completed
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {task.completed ? "Completed" : "Pending"}
        </button>
      </div>

      {/* For editing the task card component or for looking the details */}
      {/* This section can be restricted for admin role only  */}
      {editingTask && (
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div
            onClick={() => e.stopPropagation}
            className="bg-white rounded-lg shadow-xl relative w-full max-w-md p-6"
          >
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-6"
            >
              {" "}
              {/* Prevent default form submission */}
              <div className="flex items-center justify-between">
                <h1 className="font-semibold text-2xl text-gray-800">
                  Create Task
                </h1>
                <button
                  className="cursor-pointer"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); //block event bubbling
                    console.log("Closing...");
                    setEditingTask(false);
                  }}
                >
                  <X size={24} />
                </button>
              </div>
              <div>
                <h2 className="text-gray-700 text-lg mb-1">Task Title</h2>
                <input
                  className="outline-none border-2 border-gray-300 h-10 p-3 w-full rounded-md focus:border-blue-500 transition-colors"
                  type="text"
                  value={task.title}
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <h2 className="text-gray-700 text-lg mb-1">Description</h2>
                <textarea
                  className="outline-none border-2 border-gray-300 h-32 p-3 w-full rounded-md resize-y focus:border-blue-500 transition-colors"
                  placeholder="Enter task description"
                  value={task.description}
                ></textarea>
              </div>
              {/* Updated grid layout for Priority, Assign to, and Due Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left column group: Priority and Assign to (stacked) */}
                <div className="flex flex-col gap-4">
                  <div>
                    <h2 className="text-gray-700 text-lg mb-1">Priority</h2>
                    <select
                      className="pl-3 h-10 border-2 border-gray-300 outline-none w-full rounded-md focus:border-blue-500 transition-colors"
                      name="priority"
                      id="priority"
                      value={task.priority}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div>
                    <h2 className="text-gray-700 text-lg mb-1">Assign to</h2>
                    <div
                      onClick={handleOpenMemberModal}
                      className="flex gap-2 justify-center items-center pl-3 pr-3 h-10 rounded-md bg-gray-200 text-gray-700 cursor-pointer hover:text-blue-600 hover:bg-blue-100 transition-colors"
                    >
                      <Users className="text-xl" /> Add members
                    </div>
                    {assignedMembers.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {assignedMembers.map((member) => (
                          <span
                            key={member.id}
                            className="flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                          >
                            {member.name}
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveAssignedMember(member.id)
                              }
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

                {/* Right column: Due Date */}
                <div>
                  <h2 className="text-gray-700 text-lg mb-1">Due Date</h2>
                  <input
                    className="pl-3 h-10 border-2 border-gray-300 outline-none w-full rounded-md focus:border-blue-500 transition-colors"
                    type="date"
                    value={task.deu_date}
                  />
                </div>
              </div>
              <div className="flex items-center justify-around gap-2">
                <button  className="w-full  bg-red-600 h-12 text-white rounded-md font-semibold text-lg hover:bg-red-700 transition-colors shadow-md">Delete</button>
                <button className="w-full bg-indigo-600 h-12 text-white rounded-md font-semibold text-lg hover:bg-indigo-700 transition-colors shadow-md">
                  Save Changes
                </button>
              </div>
            </form>
            <MemberSelectionModal
              isOpen={isMemberModalOpen}
              onClose={handleCloseMemberModal}
              membersList={availableMembers}
              assignedMembers={assignedMembers}
              onAssignMember={handleAssignMember}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
