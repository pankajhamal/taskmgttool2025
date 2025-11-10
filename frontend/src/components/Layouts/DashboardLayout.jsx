import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ListTodo, CheckCircle, Clock, LayoutDashboard } from "lucide-react";
import axios from "axios";

const DashboardLayout = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks for the logged-in admin
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const adminId = localStorage.getItem("userId"); // Get logged-in admin ID
        const res = await axios.get("http://127.0.0.1:5000/tasks", {
          params: { owner_id: adminId }, // Fetch tasks only for this admin
        });
        setTasks(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Loading tasks...</p>;
  }

  // Calculate task counts dynamically
  const allTasksCount = tasks.length;
  const pendingTasksCount = tasks.filter(
    (task) => task.status === "pending"
  ).length;
  const completedTasksCount = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  // Prepare data for charts
  const barChartData = [
    { name: "All Tasks", value: allTasksCount, fill: "#60A5FA" },
    { name: "Pending", value: pendingTasksCount, fill: "#FBBF24" },
    { name: "Completed", value: completedTasksCount, fill: "#34D399" },
  ];

  const pieChartData = [
    { name: "Pending", value: pendingTasksCount },
    { name: "Completed", value: completedTasksCount },
  ];

  const PIE_COLORS = ["#FBBF24", "#34D399"];

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="h-190 overflow-auto bg-gray-100 p-4 sm:p-6 lg:p-8 font-inter">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 flex items-center gap-2">
          <LayoutDashboard className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600" />
          Task Dashboard
        </h1>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* All Tasks */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between transform transition duration-300 hover:scale-105 hover:shadow-xl">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-100 rounded-full mr-4">
              <ListTodo className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">All Tasks</p>
              <h2 className="text-3xl font-semibold text-gray-900">
                {allTasksCount}
              </h2>
            </div>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between transform transition duration-300 hover:scale-105 hover:shadow-xl">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full mr-4">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Pending Tasks</p>
              <h2 className="text-3xl font-semibold text-gray-900">
                {pendingTasksCount}
              </h2>
            </div>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between transform transition duration-300 hover:scale-105 hover:shadow-xl">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full mr-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Completed Tasks
              </p>
              <h2 className="text-3xl font-semibold text-gray-900">
                {completedTasksCount}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Task Status Overview
          </h3>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Bar dataKey="value" barSize={75} radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Pending vs. Completed
          </h3>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Tasks
        </h3>
        {recentTasks.length > 0 ? (
          <ul className="space-y-3">
            {recentTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-2">
                  {task.status === "completed" ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-yellow-500" />
                  )}
                  <span className="text-gray-700 font-medium">
                    {task.title}
                  </span>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    task.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No recent tasks to display.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;
