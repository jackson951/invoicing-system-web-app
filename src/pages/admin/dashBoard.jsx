import React, { useState, useEffect, useMemo } from "react";
import {
  UserGroupIcon,
  DocumentCheckIcon,
  CurrencyDollarIcon,
  BellIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
  ArrowPathIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import { useDarkMode } from "../../hooks/useDarkMode.";
import { AnimatePresence, motion } from "framer-motion";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

// Utility: Generate fake user data
const generateUser = () => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  avatar: faker.image.avatar(),
  status: faker.helpers.arrayElement(["active", "inactive", "pending"]),
  lastLogin: faker.date.recent({ days: 30 }).toISOString(),
  role: faker.helpers.arrayElement(["admin", "editor", "subscriber"]),
});

// Utility: Generate fake invoice data
const generateInvoice = () => ({
  id: `INV-${faker.string.alphanumeric(8).toUpperCase()}`,
  client: faker.company.name(),
  amount: faker.number.float({ min: 50, max: 5000, precision: 0.01 }),
  status: faker.helpers.arrayElement(["paid", "pending", "overdue"]),
  dueDate: faker.date.future({ days: 30 }).toISOString().split("T")[0],
  issuedDate: faker.date.past({ days: 30 }).toISOString().split("T")[0],
});

// Utility: Generate fake recent activity
const generateActivityItem = () => {
  const type = faker.helpers.arrayElement([
    "invoice",
    "payment",
    "user",
    "system",
  ]);
  const date = faker.date.recent({ days: 7 }).toISOString();

  switch (type) {
    case "invoice":
      return {
        id: faker.string.uuid(),
        type,
        date,
        title: `Invoice #${faker.string.alphanumeric(8).toUpperCase()}`,
        description: `Created for ${faker.company.name()}`,
        icon: <DocumentCheckIcon className="h-5 w-5 text-blue-500" />,
      };
    case "payment":
      return {
        id: faker.string.uuid(),
        type,
        date,
        title: `Payment Received`,
        description: `$${faker.number.float({
          min: 50,
          max: 500,
          precision: 2,
        })} from ${faker.person.fullName()}`,
        icon: <CurrencyDollarIcon className="h-5 w-5 text-green-500" />,
      };
    case "system":
      return {
        id: faker.string.uuid(),
        type,
        date,
        title: `System Update`,
        description: `Version ${faker.system.semver()} deployed`,
        icon: <Cog6ToothIcon className="h-5 w-5 text-purple-500" />,
      };
    case "user":
    default:
      return {
        id: faker.string.uuid(),
        type,
        date,
        title: `New User`,
        description: `${faker.person.fullName()} registered (${faker.company.buzzNoun()} ${faker.company.buzzAdjective()})`,
        icon: <UserGroupIcon className="h-5 w-5 text-indigo-500" />,
      };
  }
};

// Custom components
const StatusPill = ({ status }) => {
  const statusMap = {
    active: { color: "bg-green-100 text-green-800", text: "Active" },
    inactive: { color: "bg-gray-100 text-gray-800", text: "Inactive" },
    pending: { color: "bg-yellow-100 text-yellow-800", text: "Pending" },
    paid: { color: "bg-green-100 text-green-800", text: "Paid" },
    overdue: { color: "bg-red-100 text-red-800", text: "Overdue" },
    default: { color: "bg-blue-100 text-blue-800", text: status },
  };

  const { color, text } = statusMap[status] || statusMap.default;

  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${color}`}>
      {text}
    </span>
  );
};

const Avatar = ({ src, name, size = "md" }) => {
  const sizeClass = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }[size];

  return (
    <div
      className={`${sizeClass} rounded-full bg-gray-200 flex items-center justify-center overflow-hidden`}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span className="text-gray-600 font-medium">
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </span>
      )}
    </div>
  );
};

const DataCard = ({ title, value, change, icon, color }) => {
  const isPositive = change >= 0;
  const colorClasses =
    {
      indigo: "from-indigo-400 to-indigo-600",
      green: "from-green-400 to-green-600",
      yellow: "from-yellow-400 to-yellow-600",
      purple: "from-purple-400 to-purple-600",
      blue: "from-blue-400 to-blue-600",
      red: "from-red-400 to-red-600",
    }[color] || "from-indigo-400 to-indigo-600";

  return (
    <div
      className={`bg-gradient-to-br ${colorClasses} text-white p-6 rounded-xl shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg bg-white bg-opacity-20 backdrop-blur-sm">
          {React.cloneElement(icon, { className: "h-6 w-6 opacity-90" })}
        </div>
        <div className="text-xs font-medium bg-white bg-opacity-20 px-2 py-1 rounded-full">
          {isPositive ? (
            <span className="flex items-center">
              <ArrowTrendingUpIcon className="h-3 w-3 mr-1" /> +{change}%
            </span>
          ) : (
            <span className="flex items-center">
              <ArrowTrendingDownIcon className="h-3 w-3 mr-1" /> {change}%
            </span>
          )}
        </div>
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-3xl font-bold my-2">{value}</p>
      <p className="text-xs opacity-90">
        {isPositive ? "Increased" : "Decreased"} from last period
      </p>
    </div>
  );
};

const ActivityItem = ({ activity }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
    >
      <div className="flex-shrink-0 mt-1">{activity.icon}</div>
      <div className="ml-3 flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {activity.title}
          </p>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(activity.date)}
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {activity.description}
        </p>
      </div>
    </motion.div>
  );
};

const AdminDashboard = () => {
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [userFullName, setUserFullName] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeInvoices, setActiveInvoices] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [users, setUsers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationCount, setNotificationCount] = useState(3);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Generate chart labels
  const chartLabels = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString("en-US", { weekday: "short" });
    });
  }, []);

  // Revenue chart data
  const revenueChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Revenue ($)",
        data: revenueData,
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.3,
        fill: true,
        pointBackgroundColor: "rgb(16, 185, 129)",
        pointBorderColor: "#fff",
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgb(16, 185, 129)",
        pointHoverBorderColor: "#fff",
        pointHitRadius: 10,
        pointBorderWidth: 2,
      },
    ],
  };

  // User growth chart data
  const userGrowthChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "New Users",
        data: userGrowthData,
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderRadius: 4,
      },
    ],
  };

  // User roles pie chart data
  const userRolesChartData = {
    labels: ["Admin", "Editor", "Subscriber"],
    datasets: [
      {
        data: [
          users.filter((u) => u.role === "admin").length,
          users.filter((u) => u.role === "editor").length,
          users.filter((u) => u.role === "subscriber").length,
        ],
        backgroundColor: [
          "rgba(99, 102, 241, 0.7)",
          "rgba(139, 92, 246, 0.7)",
          "rgba(168, 85, 247, 0.7)",
        ],
        borderColor: [
          "rgba(99, 102, 241, 1)",
          "rgba(139, 92, 246, 1)",
          "rgba(168, 85, 247, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Invoice status pie chart data
  const invoiceStatusChartData = {
    labels: ["Paid", "Pending", "Overdue"],
    datasets: [
      {
        data: [
          invoices.filter((i) => i.status === "paid").length,
          invoices.filter((i) => i.status === "pending").length,
          invoices.filter((i) => i.status === "overdue").length,
        ],
        backgroundColor: [
          "rgba(16, 185, 129, 0.7)",
          "rgba(234, 179, 8, 0.7)",
          "rgba(239, 68, 68, 0.7)",
        ],
        borderColor: [
          "rgba(16, 185, 129, 1)",
          "rgba(234, 179, 8, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Fetch data
  useEffect(() => {
    const fetchDashboardData = () => {
      setIsRefreshing(true);

      // Get the user's full name from localStorage
      const user = JSON.parse(localStorage.getItem("user")) || {
        fullName: "Alex Johnson",
        email: "admin@example.com",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      };
      setUserFullName(user.fullName);

      // Generate fake data
      setTotalUsers(faker.number.int({ min: 150, max: 300 }));
      setActiveInvoices(faker.number.int({ min: 80, max: 150 }));
      const revenue = faker.number.float({
        min: 10000,
        max: 25000,
        precision: 0,
      });
      setMonthlyRevenue(revenue);

      // Generate recent activity
      setRecentActivity(
        Array.from({ length: 8 }, () => generateActivityItem())
      );

      // Generate chart data
      setRevenueData(
        Array.from({ length: 7 }, () =>
          faker.number.float({ min: 1000, max: 4000, precision: 0 })
        )
      );
      setUserGrowthData(
        Array.from({ length: 7 }, () => faker.number.int({ min: 5, max: 20 }))
      );

      // Generate users and invoices
      setUsers(Array.from({ length: 12 }, () => generateUser()));
      setInvoices(Array.from({ length: 8 }, () => generateInvoice()));

      setTimeout(() => {
        setLoading(false);
        setIsRefreshing(false);
      }, 800);
    };

    fetchDashboardData();

    // Simulate real-time updates
    const intervalId = setInterval(() => {
      setTotalUsers((prev) => prev + faker.number.int({ min: -1, max: 3 }));
      setActiveInvoices((prev) => prev + faker.number.int({ min: -1, max: 2 }));
      setMonthlyRevenue(
        (prev) =>
          prev + faker.number.float({ min: -50, max: 100, precision: 0 })
      );
      setRevenueData((prev) => [
        ...prev.slice(1),
        faker.number.float({ min: 1000, max: 4000, precision: 0 }),
      ]);
      setUserGrowthData((prev) => [
        ...prev.slice(1),
        faker.number.int({ min: 5, max: 20 }),
      ]);
      setRecentActivity((prev) => [
        generateActivityItem(),
        ...prev.slice(0, 7),
      ]);

      // Occasionally add a new user or invoice
      if (Math.random() > 0.7) {
        setUsers((prev) => [generateUser(), ...prev.slice(0, 11)]);
      }
      if (Math.random() > 0.7) {
        setInvoices((prev) => [generateInvoice(), ...prev.slice(0, 7)]);
      }

      // Occasionally add a notification
      if (Math.random() > 0.8 && notificationCount < 10) {
        setNotificationCount((prev) => prev + 1);
      }
    }, 8000);

    return () => clearInterval(intervalId);
  }, [notificationCount]);

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  // Filter invoices based on search query
  const filteredInvoices = useMemo(() => {
    return invoices.filter(
      (invoice) =>
        invoice.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [invoices, searchQuery]);

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col fixed inset-y-0">
        <div className="flex flex-col flex-grow pt-5 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-8">
            <div className="w-auto h-8 text-indigo-600 dark:text-indigo-400 font-bold text-2xl">
              AdminPro
            </div>
          </div>
          <div className="flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg w-full transition-colors ${
                  activeTab === "dashboard"
                    ? "bg-indigo-100 text-indigo-800 dark:bg-gray-700 dark:text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <ChartBarIcon className="h-5 w-5 mr-3" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg w-full transition-colors ${
                  activeTab === "users"
                    ? "bg-indigo-100 text-indigo-800 dark:bg-gray-700 dark:text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <UserGroupIcon className="h-5 w-5 mr-3" />
                Users
              </button>
              <button
                onClick={() => setActiveTab("invoices")}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg w-full transition-colors ${
                  activeTab === "invoices"
                    ? "bg-indigo-100 text-indigo-800 dark:bg-gray-700 dark:text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <DocumentCheckIcon className="h-5 w-5 mr-3" />
                Invoices
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg w-full transition-colors ${
                  activeTab === "settings"
                    ? "bg-indigo-100 text-indigo-800 dark:bg-gray-700 dark:text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <Cog6ToothIcon className="h-5 w-5 mr-3" />
                Settings
              </button>
            </nav>
          </div>
          <div className="p-4">
            <div className="flex items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <Avatar
                src={JSON.parse(localStorage.getItem("user"))?.avatar}
                name={userFullName}
                size="sm"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {userFullName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Admin
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:pl-64 flex flex-col">
        {/* Top Navigation */}
        <header className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center">
              <button className="md:hidden mr-2 text-gray-500 dark:text-gray-400">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {activeTab === "dashboard" && "Dashboard"}
                {activeTab === "users" && "User Management"}
                {activeTab === "invoices" && "Invoice Management"}
                {activeTab === "settings" && "Settings"}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={refreshData}
                className={`p-2 rounded-full text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              >
                <ArrowPathIcon className="h-5 w-5" />
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {darkMode ? (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>
              <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                <BellIcon className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </button>
              <div className="hidden md:block">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 pb-8">
          {activeTab === "dashboard" && (
            <div className="px-6 py-6 space-y-6">
              {/* Header Section */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    Welcome back, {userFullName.split(" ")[0]} 👋
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Here's what's happening with your business today.
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-3">
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Export
                  </button>
                  <button className="px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium text-white hover:bg-indigo-700 transition-colors flex items-center">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    New Report
                  </button>
                </div>
              </div>

              {/* KPI Cards */}
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DataCard
                  title="Total Users"
                  value={totalUsers}
                  change={faker.number.int({ min: -5, max: 15 })}
                  icon={<UserGroupIcon />}
                  color="indigo"
                />
                <DataCard
                  title="Active Invoices"
                  value={activeInvoices}
                  change={faker.number.int({ min: -10, max: 20 })}
                  icon={<DocumentCheckIcon />}
                  color="green"
                />
                <DataCard
                  title="Monthly Revenue"
                  value={`$${monthlyRevenue.toLocaleString()}`}
                  change={faker.number.int({ min: -5, max: 10 })}
                  icon={<CurrencyDollarIcon />}
                  color="yellow"
                />
                <DataCard
                  title="Avg. Invoice Value"
                  value={`$${
                    activeInvoices > 0
                      ? (monthlyRevenue / activeInvoices).toFixed(2)
                      : "0.00"
                  }`}
                  change={faker.number.int({ min: -2, max: 5 })}
                  icon={<ChartBarIcon />}
                  color="purple"
                />
              </section>

              {/* Graph Section */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Revenue Trend (Last 7 Days)
                    </h3>
                    <select className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                      <option>Last Quarter</option>
                    </select>
                  </div>
                  <div className="h-80">
                    <Line
                      data={revenueChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                          tooltip: {
                            mode: "index",
                            intersect: false,
                          },
                        },
                        hover: {
                          mode: "nearest",
                          intersect: true,
                        },
                        scales: {
                          y: {
                            beginAtZero: false,
                            grid: {
                              color: darkMode
                                ? "rgba(255, 255, 255, 0.05)"
                                : "rgba(0, 0, 0, 0.05)",
                            },
                            ticks: {
                              color: darkMode
                                ? "rgba(255, 255, 255, 0.6)"
                                : "rgba(0, 0, 0, 0.6)",
                            },
                          },
                          x: {
                            grid: {
                              display: false,
                            },
                            ticks: {
                              color: darkMode
                                ? "rgba(255, 255, 255, 0.6)"
                                : "rgba(0, 0, 0, 0.6)",
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                {/* User Growth Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      User Growth (Last 7 Days)
                    </h3>
                    <select className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                      <option>Last Quarter</option>
                    </select>
                  </div>
                  <div className="h-80">
                    <Bar
                      data={userGrowthChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            grid: {
                              color: darkMode
                                ? "rgba(255, 255, 255, 0.05)"
                                : "rgba(0, 0, 0, 0.05)",
                            },
                            ticks: {
                              color: darkMode
                                ? "rgba(255, 255, 255, 0.6)"
                                : "rgba(0, 0, 0, 0.6)",
                              precision: 0,
                            },
                          },
                          x: {
                            grid: {
                              display: false,
                            },
                            ticks: {
                              color: darkMode
                                ? "rgba(255, 255, 255, 0.6)"
                                : "rgba(0, 0, 0, 0.6)",
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </section>

              {/* Bottom Section */}
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <BellIcon className="h-5 w-5 mr-2 text-indigo-500" />
                      Recent Activity
                    </h3>
                    <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                      View All
                    </button>
                  </div>
                  <div className="space-y-4">
                    <AnimatePresence>
                      {recentActivity.map((activity) => (
                        <ActivityItem key={activity.id} activity={activity} />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Stats + Pie Charts */}
                <div className="space-y-6">
                  {/* User Roles */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      User Roles Distribution
                    </h3>
                    <div className="h-48">
                      <Pie
                        data={userRolesChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "right",
                              labels: {
                                color: darkMode
                                  ? "rgba(255, 255, 255, 0.7)"
                                  : "rgba(0, 0, 0, 0.7)",
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>

                  {/* Invoice Status */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Invoice Status
                    </h3>
                    <div className="h-48">
                      <Pie
                        data={invoiceStatusChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "right",
                              labels: {
                                color: darkMode
                                  ? "rgba(255, 255, 255, 0.7)"
                                  : "rgba(0, 0, 0, 0.7)",
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === "users" && (
            <div className="px-6 py-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    User Management
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Manage all registered users and their permissions.
                  </p>
                </div>
                <button className="mt-4 md:mt-0 px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium text-white hover:bg-indigo-700 transition-colors flex items-center">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add New User
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          User
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Role
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Last Login
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Avatar
                                src={user.avatar}
                                name={user.name}
                                size="sm"
                              />
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {user.name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusPill status={user.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize">
                            {user.role}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(user.lastLogin).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-3">
                              Edit
                            </button>
                            <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-600">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      Previous
                    </button>
                    <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Showing <span className="font-medium">1</span> to{" "}
                        <span className="font-medium">10</span> of{" "}
                        <span className="font-medium">
                          {filteredUsers.length}
                        </span>{" "}
                        results
                      </p>
                    </div>
                    <div>
                      <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                      >
                        <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600">
                          <span className="sr-only">Previous</span>
                          <svg
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        <button
                          aria-current="page"
                          className="z-10 bg-indigo-50 dark:bg-gray-600 border-indigo-500 dark:border-gray-500 text-indigo-600 dark:text-white relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                        >
                          1
                        </button>
                        <button className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                          2
                        </button>
                        <button className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                          3
                        </button>
                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
                          ...
                        </span>
                        <button className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                          8
                        </button>
                        <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600">
                          <span className="sr-only">Next</span>
                          <svg
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "invoices" && (
            <div className="px-6 py-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    Invoice Management
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    View and manage all invoices.
                  </p>
                </div>
                <button className="mt-4 md:mt-0 px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium text-white hover:bg-indigo-700 transition-colors flex items-center">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Invoice
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Invoice ID
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Client
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Due Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredInvoices.map((invoice) => (
                        <tr
                          key={invoice.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {invoice.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {invoice.client}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            ${invoice.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusPill status={invoice.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(invoice.dueDate).toLocaleDateString()}
                            {invoice.status === "overdue" && (
                              <span className="ml-2 text-xs text-red-500">
                                Overdue
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-3">
                              View
                            </button>
                            <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 mr-3">
                              Edit
                            </button>
                            <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-600">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      Previous
                    </button>
                    <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Showing <span className="font-medium">1</span> to{" "}
                        <span className="font-medium">10</span> of{" "}
                        <span className="font-medium">
                          {filteredInvoices.length}
                        </span>{" "}
                        results
                      </p>
                    </div>
                    <div>
                      <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                      >
                        <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600">
                          <span className="sr-only">Previous</span>
                          <svg
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        <button
                          aria-current="page"
                          className="z-10 bg-indigo-50 dark:bg-gray-600 border-indigo-500 dark:border-gray-500 text-indigo-600 dark:text-white relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                        >
                          1
                        </button>
                        <button className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                          2
                        </button>
                        <button className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                          3
                        </button>
                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
                          ...
                        </span>
                        <button className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                          8
                        </button>
                        <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600">
                          <span className="sr-only">Next</span>
                          <svg
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="px-6 py-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Configure your account and application preferences.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Account Settings
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Avatar
                        src={JSON.parse(localStorage.getItem("user"))?.avatar}
                        name={userFullName}
                        size="lg"
                      />
                      <div>
                        <button className="px-3 py-1.5 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                          Change Avatar
                        </button>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          JPG, GIF or PNG. Max size of 2MB
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="fullName"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          defaultValue={userFullName}
                          className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          defaultValue="admin@example.com"
                          className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="timezone"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Timezone
                        </label>
                        <select
                          id="timezone"
                          className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                          <option>
                            (UTC-12:00) International Date Line West
                          </option>
                          <option>(UTC-11:00) Midway Island, Samoa</option>
                          <option>(UTC-10:00) Hawaii</option>
                          <option>(UTC-09:00) Alaska</option>
                          <option>
                            (UTC-08:00) Pacific Time (US & Canada)
                          </option>
                          <option>
                            (UTC-07:00) Mountain Time (US & Canada)
                          </option>
                          <option selected>
                            (UTC-06:00) Central Time (US & Canada)
                          </option>
                          <option>
                            (UTC-05:00) Eastern Time (US & Canada)
                          </option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="language"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Language
                        </label>
                        <select
                          id="language"
                          className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                          <option>English</option>
                          <option>Spanish</option>
                          <option>French</option>
                          <option>German</option>
                          <option>Chinese</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button className="px-4 py-2 bg-indigo-600 rounded-md text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Change Password
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="currentPassword"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Current Password
                        </label>
                        <input
                          type="password"
                          id="currentPassword"
                          className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="newPassword"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          New Password
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div className="pt-2">
                        <button className="px-4 py-2 bg-indigo-600 rounded-md text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
                          Update Password
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Notification Preferences
                    </h2>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <label
                            htmlFor="emailNotifications"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Email Notifications
                          </label>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Receive email notifications for important updates
                          </p>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            id="emailNotifications"
                            defaultChecked
                            className="sr-only"
                          />
                          <label
                            htmlFor="emailNotifications"
                            className="block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer"
                          >
                            <span className="block h-6 w-6 rounded-full bg-white dark:bg-gray-300 shadow-md transform transition-transform duration-200 ease-in-out translate-x-4"></span>
                          </label>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label
                            htmlFor="pushNotifications"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Push Notifications
                          </label>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Receive push notifications on your device
                          </p>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            id="pushNotifications"
                            defaultChecked
                            className="sr-only"
                          />
                          <label
                            htmlFor="pushNotifications"
                            className="block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer"
                          >
                            <span className="block h-6 w-6 rounded-full bg-white dark:bg-gray-300 shadow-md transform transition-transform duration-200 ease-in-out translate-x-4"></span>
                          </label>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label
                            htmlFor="smsNotifications"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            SMS Notifications
                          </label>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Receive text messages for urgent matters
                          </p>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            id="smsNotifications"
                            className="sr-only"
                          />
                          <label
                            htmlFor="smsNotifications"
                            className="block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer"
                          >
                            <span className="block h-6 w-6 rounded-full bg-white dark:bg-gray-300 shadow-md transform transition-transform duration-200 ease-in-out"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
