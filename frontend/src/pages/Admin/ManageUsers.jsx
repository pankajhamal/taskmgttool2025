import React, { useState } from "react";
import { Mail, Calendar, Pencil, Trash2, Plus, X } from "lucide-react";

const generateAvatarProps = (name) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  const colors = [
    "bg-purple-500",
    "bg-blue-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-green-500",
    "bg-rose-500",
    "bg-yellow-500",
    "bg-teal-500",
  ];
  const bgColor = colors[Math.floor(Math.random() * colors.length)];
  return { initials, bgColor };
};

export default function App() {
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      initials: "PH",
      name: "Pankaj Hamal",
      role: "Frontend Developer",
      email: "pankaj@gmail.com",
      joinedDate: "Joined 12/1/2023",
      bgColor: "bg-indigo-500",
    },
    {
      id: 2,
      initials: "KR",
      name: "Kshitiz Rawal",
      role: "Project Manager",
      email: "kshitiz@gmail.com",
      joinedDate: "Joined 12/1/2023",
      bgColor: "bg-green-500",
    },
    {
      id: 3,
      initials: "SJ",
      name: "Diya Bogati",
      role: "UI/UX Designer",
      email: "diya@gmail.com",
      joinedDate: "Joined 12/1/2023",
      bgColor: "bg-purple-500",
    },
    {
      id: 4,
      initials: "PR",
      name: "Piyus Rawal",
      role: "Backend Developer",
      email: "piyus@.com",
      joinedDate: "Joined 12/1/2023",
      bgColor: "bg-purple-500",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    email: "",
    role: "",
  });
  const [editingMember, setEditingMember] = useState(null);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.role) {
      alert("Please fill in all fields.");
      return;
    }

    if (editingMember) {
      setTeamMembers((prev) =>
        prev.map((member) =>
          member.id === formData.id ? { ...member, ...formData } : member
        )
      );
      setEditingMember(null);
    } else {
      const today = new Date();
      const joinedDate = `Joined ${today.toLocaleDateString("en-US")}`;
      const { initials, bgColor } = generateAvatarProps(formData.name);
      const newMember = {
        id: Date.now(),
        ...formData,
        initials,
        bgColor,
        joinedDate,
      };
      setTeamMembers((prev) => [...prev, newMember]);
    }

    setFormData({ id: null, name: "", email: "", role: "" });
    setShowForm(false);
  };

  const handleEditClick = (memberToEdit) => {
    setEditingMember(memberToEdit);
    setFormData({
      id: memberToEdit.id,
      name: memberToEdit.name,
      email: memberToEdit.email,
      role: memberToEdit.role,
    });
    setShowForm(true);
  };

  const handleDeleteClick = (idToDelete) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      setTeamMembers((prev) =>
        prev.filter((member) => member.id !== idToDelete)
      );
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingMember(null);
    setFormData({ id: null, name: "", email: "", role: "" });
  };

  return (
    <div className="h-[700px] bg-gray-100 p-6 font-sans ">
      <div className="max-w-4xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Team Members</h1>
            <p className="text-gray-600 text-lg">
              Manage your team and assign roles
            </p>
          </div>
          <button
            onClick={() => {
              setEditingMember(null);
              setFormData({ id: null, name: "", email: "", role: "" });
              setShowForm(true);
            }}
            className="flex items-center px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200 mt-4 sm:mt-0"
          >
            <Plus size={20} className="mr-2" /> Add Member
          </button>
        </div>

        <div className=" flex flex-col gap-4 overflow-y-auto max-h-[70vh] pr-2">
          {teamMembers.length > 0 ? (
            teamMembers.map((member) => (
              <div
                key={member.id}
                className=" bg-white rounded-lg shadow-md p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center border border-gray-200 hover:shadow-lg transition "
              >
                <div className="flex items-center mb-4 sm:mb-0 sm:mr-6 w-full sm:w-auto">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold ${member.bgColor} flex-shrink-0 mr-4`}
                  >
                    {member.initials}
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {member.name}
                    </h2>
                    <p className="text-blue-600 text-sm font-medium">
                      {member.role}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-0 sm:space-x-6 flex flex-col sm:flex-row items-start sm:items-center text-gray-600 text-sm flex-grow sm:flex-grow-0">
                  <div className="flex items-center">
                    <Mail size={16} className="mr-2 text-gray-500" />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2 text-gray-500" />
                    <span>{member.joinedDate}</span>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-4 sm:mt-0 ml-auto">
                  <button
                    onClick={() => handleEditClick(member)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(member.id)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 p-8 bg-white rounded-lg shadow-md border border-gray-200">
              No team members added yet.
            </div>
          )}
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl relative w-full max-w-md p-6">
            <button
              onClick={handleCloseForm}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {editingMember ? "Edit Team Member" : "Add New Team Member"}
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Pankaj hamal"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="e.g. pankaj@gmail.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  placeholder="e.g. Project Manager"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingMember ? "Save Changes" : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
