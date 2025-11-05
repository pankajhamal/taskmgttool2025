import React, { useState, useEffect } from "react";
import { Mail, Calendar, Pencil, Trash2, Plus, X } from "lucide-react";
import { fetchUsers} from "../../api";

// --- DUMMY DATA FOR DEVELOPMENT ---
// The 'created_at' property is retained in the source data but will not be processed into 'joinedDate'
const DUMMY_USERS = [
  {
    id: 1,
    username: "Pankaj Hamal",
    email: "pankaj.h@example.com",
    role: "admin",
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(), // 30 days ago
  },
  {
    id: 2,
    username: "Sushma Bista",
    email: "sushma.b@example.com",
    role: "user",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
  },
  {
    id: 3,
    username: "Aarav Sharma",
    email: "aarav.s@example.com",
    role: "user",
    created_at: new Date(Date.now() - 86400000 * 120).toISOString(), // 120 days ago
  },
  {
    id: 4,
    username: "Dipesh Rana",
    email: "dipesh.r@example.com",
    role: "user",
    created_at: new Date(Date.now() - 86400000 * 60).toISOString(), // 60 days ago
  },
];
// --- END DUMMY DATA ---

// Generate avatar initials and background color
const generateAvatarProps = (username) => {
  const initials = username
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

export default function ManageUsers() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const [editingMember, setEditingMember] = useState(null);

  // Helper function to process raw user data
  const processUsers = (users) => {
    return users.map((u) => ({
      id: u.id,
      username: u.username,
      email: u.email,
      role: u.role,
      password: "••••••••",
      // REMOVED: joinedDate calculation
      ...generateAvatarProps(u.username),
    }));
  };

  // Load users from backend (with dummy data fallback)
const loadUsers = async () => {
  try {
    const res = await fetchUsers();
    setTeamMembers(
      res.data.map(user => ({
        ...user,
        password: "••••••••",
        ...generateAvatarProps(user.username)
      }))
    );
    console.log("Users loaded from backend:", res.data);
  } catch (err) {
    console.error("Failed to fetch users from backend:", err);
    setTeamMembers([]); // No dummy data
  }
};

  useEffect(() => {
    loadUsers();
  }, []);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.role || !formData.email || (!editingMember && !formData.password)) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      if (editingMember) {
        // Optimistic update
        const updatedList = teamMembers.map(member =>
            member.id === formData.id
                ? { ...member, username: formData.username, email: formData.email, role: formData.role, ...generateAvatarProps(formData.username) }
                : member
        );
        setTeamMembers(updatedList);
        await updateUser(formData.id, formData);
        alert("User updated successfully! (Note: API call likely failed)");
      } else {
        // Optimistic add
        const newId = Math.max(...teamMembers.map(m => m.id), 0) + 1; // Use 0 for initial case
        const newUser = {
            id: newId,
            username: formData.username,
            email: formData.email,
            role: formData.role,
            password: "••••••••",
            // REMOVED: joinedDate property
            ...generateAvatarProps(formData.username),
        };
        setTeamMembers(prev => [...prev, newUser]);
        await addUser(formData);
        alert("User added successfully! (Note: API call likely failed)");
      }

      setShowForm(false);
      setEditingMember(null);
      setFormData({ id: null, username: "", email: "", password: "", role: "user" });
    } catch (err) {
      console.error(err);
      // alert("Operation failed. Check backend.");
    }
  };

  const handleEditClick = (member) => {
    setEditingMember(member);
    setFormData({
      id: member.id,
      username: member.username,
      email: member.email,
      password: "", // leave empty so admin can reset
      role: member.role,
    });
    setShowForm(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        // Optimistic delete
        setTeamMembers(teamMembers.filter(member => member.id !== id));
        await deleteUser(id);
        alert("User deleted successfully! (Note: API call likely failed)");
      } catch (err) {
        console.error(err);
        // alert("Delete failed.");
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingMember(null);
    setFormData({ id: null, username: "", email: "", password: "", role: "user" });
  };

  return (
    <div className="h-160 bg-gray-100 p-6 font-sans ">
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
              setFormData({ id: null, username: "", email: "", password: "", role: "user" });
              setShowForm(true);
            }}
            className="flex items-center px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200 mt-4 sm:mt-0"
          >
            <Plus size={20} className="mr-2" /> Add Member
          </button>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto max-h-[70vh] pr-2">
          {teamMembers.length > 0 ? (
            teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-lg shadow-md p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center border border-gray-200 hover:shadow-lg transition "
              >
                <div className="flex items-center mb-4 sm:mb-0 sm:mr-6 w-full sm:w-auto">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold ${member.bgColor} flex-shrink-0 mr-4`}
                  >
                    {member.initials}
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {member.username}
                    </h2>
                    <p className="text-blue-600 text-sm font-medium">
                      {member.role}
                    </p>
                  </div>
                </div>

                {/* Updated display section: Only shows Email */}
                <div className="space-y-3 sm:space-y-0 sm:space-x-6 flex flex-col sm:flex-row items-start sm:items-center text-gray-600 text-sm flex-grow sm:flex-grow-0">
                  <div className="flex items-center">
                    <Mail size={16} className="mr-2 text-gray-500" />
                    <span>{member.email}</span>
                  </div>
                  {/* REMOVED: Joined Date block */}
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

      {/* Add/Edit Form */}
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
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="e.g. Pankaj Hamal"
                  value={formData.username}
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
                  placeholder="e.g. email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required={!editingMember} // required only for new user
                  placeholder={editingMember ? "Leave blank to keep current password" : ""}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
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