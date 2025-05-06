import React, { useState, useEffect, useMemo } from "react";
import {
  UserGroupIcon,
  DocumentCheckIcon,
  CurrencyDollarIcon,
  BellIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
  ArrowPathIcon,
  PlusIcon,
  XMarkIcon,
  Bars3Icon,
  UserIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
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
import { generatePermissions } from "../../utils/permissions";
import { useAuth } from "../../contexts/AuthContext";
import { ApiService } from "../../api/web-api-service";
import { toast } from "react-toastify";

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

// Status Pill Component
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

// Avatar Component
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
            ?.split(" ")
            .map((n) => n[0])
            .join("")}
        </span>
      )}
    </div>
  );
};

// Data Card Component
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

// Activity Item Component
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

// AdminDashboard Component
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
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationCount, setNotificationCount] = useState(3);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modal states
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [isAddInvoiceModalOpen, setIsAddInvoiceModalOpen] = useState(false);
  const [isViewUserModalOpen, setIsViewUserModalOpen] = useState(false);
  const [isViewCustomerModalOpen, setIsViewCustomerModalOpen] = useState(false);
  const [isViewInvoiceModalOpen, setIsViewInvoiceModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isEditCustomerModalOpen, setIsEditCustomerModalOpen] = useState(false);
  const [isEditInvoiceModalOpen, setIsEditInvoiceModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [currentInvoice, setCurrentInvoice] = useState(null);

  const { user, authToken } = useAuth();

  const [newUserForm, setNewUserForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "subscriber", // or "editor", "admin"
    status: "active", // e.g., "active", "inactive"
    permissions: "", // e.g., "view_invoices,edit_customers"
    avatar: "", // optional, for profile picture uploads
  });

  const [newCustomerForm, setNewCustomerForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    type: "individual", // or "company", depending on your default
  });

  const [newInvoiceForm, setNewInvoiceForm] = useState({
    client: "",
    customerId: "",
    amount: "",
    status: "pending",
    dueDate: "",
    issuedDate: "",
  });
  const BASE_URL = "https://localhost:7221/api";
  // Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await ApiService.get("/employee", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        const parsedUsers = res.data.map((emp) => ({
          ...emp,
          permissions:
            typeof emp.permissions === "string"
              ? JSON.parse(emp.permissions)
              : emp.permissions,
        }));
        console.log(parsedUsers, "those users i love");

        setUsers(parsedUsers);
      } catch (error) {
        if (error.response) {
          console.error(
            "Server error:",
            error.response.status,
            error.response.data
          );
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Axios config error:", error.message);
        }
      }
    };
    console.log(authToken, "the auth token");
    if (authToken) {
      fetchEmployees();
    }
  }, [authToken]);

  // Filter users, customers and invoices
  const filteredUsers = useMemo(() => {
    return users?.filter((user) => {
      const name = user?.name || "";
      const email = user?.email || "";
      return (
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [users, searchQuery]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(
      (customer) =>
        (customer.name || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (customer.company || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (customer.email || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [customers, searchQuery]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter(
      (invoice) =>
        (invoice.client || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (invoice.id || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [invoices, searchQuery]);

  // Load data from localStorage
  const [storedUser, setStoredUser] = useState({});
  useEffect(() => {
    const currentuser = user || {
      fullName: "Alex Johnson",
      email: "admin@example.com",
      password: "password123",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    };
    setStoredUser(currentuser);
    setUserFullName(currentuser.fullName); // now uses the correct updated value

    // const storedUsers =
    //   JSON.parse(localStorage.getItem("users")) ||
    //   Array.from({ length: 5 }, () => generateUser());
    // setUsers(storedUsers);

    const storedCustomers =
      JSON.parse(localStorage.getItem("customers")) ||
      Array.from({ length: 8 }, () => generateCustomer());
    setCustomers(storedCustomers);

    const storedInvoices =
      JSON.parse(localStorage.getItem("invoices")) ||
      Array.from({ length: 8 }, () => generateInvoice(storedCustomers));
    setInvoices(storedInvoices);

    // Generate some random data for charts
    setRevenueData(
      Array.from({ length: 7 }, () =>
        faker.number.float({ min: 1000, max: 5000 })
      )
    );
    setUserGrowthData(
      Array.from({ length: 7 }, () => faker.number.int({ min: 1, max: 20 }))
    );
    setMonthlyRevenue(faker.number.float({ min: 5000, max: 20000 }));

    // Generate some recent activity
    setRecentActivity(
      Array.from({ length: 5 }, () => ({
        id: faker.string.uuid(),
        title: faker.helpers.arrayElement([
          "New user registered",
          "Invoice paid",
          "New customer added",
          "System updated",
          "Password changed",
        ]),
        description: faker.lorem.sentence(),
        date: faker.date.recent({ days: 1 }).toISOString(),
        icon: (
          <div className="p-2 rounded-full bg-indigo-100 text-indigo-600 dark:bg-gray-700 dark:text-indigo-400">
            <BellIcon className="h-4 w-4" />
          </div>
        ),
      }))
    );

    setLoading(false);
  }, []);

  // Generate User (for initial load)
  const generateUser = () => ({
    id: faker.string.uuid(),
    fullName: faker.person.fullName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    status: faker.helpers.arrayElement(["active", "inactive", "pending"]),
    lastLogin: faker.date.recent({ days: 30 }).toISOString(),
    role: faker.helpers.arrayElement(["admin", "editor", "subscriber"]),
    permissions: generatePermissions(),
    password: "password123", // for demo
  });

  // Generate Customer (for initial load)
  const generateCustomer = () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    company: faker.company.name(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address: `${faker.location.streetAddress()}, ${faker.location.city()}`,
    createdAt: faker.date.past({ years: 1 }).toISOString(),
  });

  // Generate Invoice (for initial load)
  const generateInvoice = (customerList) => {
    const customer = faker.helpers.arrayElement(customerList);
    return {
      id: `INV-${faker.string.alphanumeric(8).toUpperCase()}`,
      client: customer.name,
      customerId: customer.id,
      company: customer.company,
      amount: faker.number.float({ min: 50, max: 5000, precision: 0.01 }),
      status: faker.helpers.arrayElement(["paid", "pending", "overdue"]),
      dueDate: faker.date.future({ days: 30 }).toISOString().split("T")[0],
      issuedDate: faker.date.past({ days: 30 }).toISOString().split("T")[0],
    };
  };

  const addEmployee = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User is not authenticated.");
      return;
    }

    const employeeData = {
      fullName: newUserForm.fullName,
      email: newUserForm.email,
      password: newUserForm.password,
      role: newUserForm.role,
      status: newUserForm.status,
      permissions: JSON.stringify(generatePermissions(newUserForm.role)),
    };

    try {
      const response = await ApiService.post(`/employee`, employeeData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const newEmployee = response.data.employee;
      const updatedUsers = [newEmployee, ...users];
      setUsers(updatedUsers);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
    } catch (error) {
      console.error("Error adding employee:", error);
      const errMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to add employee";
      throw new Error(errMessage);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await addEmployee();
      toast.success("Employee added successfully!");
      setIsAddUserModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    }
  };

  // Add new invoice from form
  const handleAddInvoice = (e) => {
    e.preventDefault();
    const selectedCustomer = customers.find(
      (c) => c.id === newInvoiceForm.customerId
    );
    const invoiceToAdd = {
      ...newInvoiceForm,
      id: `INV-${faker.string.alphanumeric(8).toUpperCase()}`,
      client: selectedCustomer?.name || newInvoiceForm.client,
      company: selectedCustomer?.company || "",
    };
    const updatedInvoices = [invoiceToAdd, ...invoices];
    setInvoices(updatedInvoices);
    localStorage.setItem("invoices", JSON.stringify(updatedInvoices));
    setNewInvoiceForm({
      client: "",
      customerId: "",
      amount: "",
      status: "pending",
      dueDate: "",
      issuedDate: "",
    });
    setIsAddInvoiceModalOpen(false);
  };

  // View user details
  const handleViewUser = (user) => {
    setCurrentUser(user);
    setIsViewUserModalOpen(true);
  };

  // View customer details
  const handleViewCustomer = (customer) => {
    setCurrentCustomer(customer);
    setIsViewCustomerModalOpen(true);
  };

  // View invoice details
  const handleViewInvoice = (invoice) => {
    setCurrentInvoice(invoice);
    setIsViewInvoiceModalOpen(true);
  };

  // Edit user
  const handleEditUser = (user) => {
    setCurrentUser(user);
    setIsEditUserModalOpen(true);
  };

  // Edit customer
  const handleEditCustomer = (customer) => {
    setCurrentCustomer(customer);
    setIsEditCustomerModalOpen(true);
  };

  // Edit invoice
  const handleEditInvoice = (invoice) => {
    setCurrentInvoice(invoice);
    setIsEditInvoiceModalOpen(true);
  };

  // Save edited customer
  const handleSaveEditedCustomer = (e) => {
    e.preventDefault();
    const updatedCustomers = customers.map((c) =>
      c.id === currentCustomer.id ? currentCustomer : c
    );
    setCustomers(updatedCustomers);
    localStorage.setItem("customers", JSON.stringify(updatedCustomers));
    setIsEditCustomerModalOpen(false);
  };

  // Save edited invoice
  const handleSaveEditedInvoice = (e) => {
    e.preventDefault();
    const selectedCustomer = customers.find(
      (c) => c.id === currentInvoice.customerId
    );
    const updatedInvoice = {
      ...currentInvoice,
      client: selectedCustomer?.name || currentInvoice.client,
      company: selectedCustomer?.company || currentInvoice.company,
    };
    const updatedInvoices = invoices.map((i) =>
      i.id === updatedInvoice.id ? updatedInvoice : i
    );
    setInvoices(updatedInvoices);
    localStorage.setItem("invoices", JSON.stringify(updatedInvoices));
    setIsEditInvoiceModalOpen(false);
  };

  const deleteEmployee = async (id, token) => {
    try {
      const res = await ApiService.delete(`/employee/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      if (error.response) {
        console.error(
          "Server error:",
          error.response.status,
          error.response.data
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error:", error.message);
      }
      throw error;
    }
  };

  const handleDeleteEmployee = async (e, id) => {
    e.preventDefault(); // Prevent default form or button behavior
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (!confirmed) return;

    try {
      await deleteEmployee(id, authToken); // Call the delete API
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id)); // Update UI
      toast.success("Employee deleted successfully.");
    } catch (error) {
      console.error("Failed to delete employee:", error);
    }
  };

  //edit employee
  const updateEmployee = async (id, data, token) => {
    try {
      const res = await ApiService.put(`/employee/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      if (error.response) {
        console.error(
          "Server error:",
          error.response.status,
          error.response.data
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error:", error.message);
      }
      throw error;
    }
  };

  const handleUpdateEmployee = async (
    e,
    id,
    formValues,
    authToken,
    closeModal,
    setUsers
  ) => {
    e.preventDefault();

    try {
      await updateEmployee(id, formValues, authToken);
      toast.success("Employee updated successfully.");
      closeModal();
      // Optionally refresh or update users
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...formValues } : u))
      );
    } catch (err) {
      toast.error("Failed to update employee.");
    }
  };

  const handleSaveEditEmployee = (e) => {
    handleUpdateEmployee(
      e,
      currentUser.id,
      {
        fullName: currentUser.fullName,
        email: currentUser.email,
        role: currentUser.role,
        status: currentUser.status,
        // Ensure this is a JSON string
        permissions:
          typeof currentUser.permissions === "string"
            ? currentUser.permissions
            : JSON.stringify(currentUser.permissions),
        // Only include password if it's part of your update model
        password: currentUser.password || "", // Optional
      },
      authToken,
      () => setIsEditUserModalOpen(false),
      setUsers
    );
  };

  // Delete customer
  const handleDeleteCustomer = (customerId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this customer? Any associated invoices will be kept but unlinked."
      )
    ) {
      const updatedCustomers = customers.filter((c) => c.id !== customerId);
      setCustomers(updatedCustomers);
      localStorage.setItem("customers", JSON.stringify(updatedCustomers));
    }
  };

  // Delete invoice
  const handleDeleteInvoice = (invoiceId) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      const updatedInvoices = invoices.filter((i) => i.id !== invoiceId);
      setInvoices(updatedInvoices);
      localStorage.setItem("invoices", JSON.stringify(updatedInvoices));
    }
  };

  // Save account settings
  const handleSaveAccountSettings = (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    const updatedUser = {
      ...storedUser,
      fullName: userFullName,
      email: e.target.email.value,
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    alert("Account settings saved successfully!");
  };

  // Change password
  const handleChangePassword = (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    console.log(storedUser, "userrrr");
    if (currentPassword !== storedUser.password) {
      alert("Current password is incorrect.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    const updatedUser = {
      ...storedUser,
      password: newPassword,
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    alert("Password updated successfully.");
  };

  //let us work on customer here
  const addCustomer = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User is not authenticated.");
      return;
    }

    const customerData = {
      name: newCustomerForm.name,
      email: newCustomerForm.email,
      phone: newCustomerForm.phone,
      address: newCustomerForm.address,
      type: newCustomerForm.type, // "individual" or "company"
    };

    try {
      const response = await ApiService.post(`/customer`, customerData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      const newCustomer =
        customerData || response.data.customer || response.data;
      const updatedCustomers = [newCustomer, ...customers];
      setCustomers(updatedCustomers);
      localStorage.setItem("customers", JSON.stringify(updatedCustomers));
    } catch (error) {
      console.error("Error adding customer:", error);
      const errMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to add customer";
      throw new Error(errMessage);
    }
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      await addCustomer();
      toast.success("Customer added successfully!");
      setIsAddCustomerModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    }
  };

  // Chart Data
  const chartLabels = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString("en-US", { weekday: "short" });
    });
  }, []);

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

  const userRolesChartData = {
    labels: ["Admin", "Editor", "Subscriber"],
    datasets: [
      {
        data: [
          users.filter((u) => u?.role === "admin").length,
          users.filter((u) => u?.role === "editor").length,
          users.filter((u) => u?.role === "subscriber").length,
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
      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <div
          className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity ${
            sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setSidebarOpen(false)}
        ></div>

        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-5 border-b border-gray-200 dark:border-gray-700">
            <div className="text-indigo-600 dark:text-indigo-400 font-bold text-xl">
              AdminPro
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="h-full overflow-y-auto">
            <nav className="px-2 py-4 space-y-1">
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  setSidebarOpen(false);
                }}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg w-full transition-colors ${
                  activeTab === "dashboard"
                    ? "bg-indigo-100 text-indigo-800 dark:bg-gray-700 dark:text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <ChartBarIcon className="h-5 w-5 mr-3" /> Dashboard
              </button>
              <button
                onClick={() => {
                  setActiveTab("users");
                  setSidebarOpen(false);
                }}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg w-full transition-colors ${
                  activeTab === "users"
                    ? "bg-indigo-100 text-indigo-800 dark:bg-gray-7 00 dark:text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <UserGroupIcon className="h-5 w-5 mr-3" /> Users
              </button>
              <button
                onClick={() => {
                  setActiveTab("customers");
                  setSidebarOpen(false);
                }}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg w-full transition-colors ${
                  activeTab === "customers"
                    ? "bg-indigo-100 text-indigo-800 dark:bg-gray-700 dark:text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <BuildingOfficeIcon className="h-5 w-5 mr-3" /> Customers
              </button>
              <button
                onClick={() => {
                  setActiveTab("invoices");
                  setSidebarOpen(false);
                }}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg w-full transition-colors ${
                  activeTab === "invoices"
                    ? "bg-indigo-100 text-indigo-800 dark:bg-gray-700 dark:text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <DocumentCheckIcon className="h-5 w-5 mr-3" /> Invoices
              </button>
              <button
                onClick={() => {
                  setActiveTab("settings");
                  setSidebarOpen(false);
                }}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg w-full transition-colors ${
                  activeTab === "settings"
                    ? "bg-indigo-100 text-indigo-800 dark:bg-gray-700 dark:text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <Cog6ToothIcon className="h-5 w-5 mr-3" /> Settings
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
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
                <ChartBarIcon className="h-5 w-5 mr-3" /> Dashboard
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg w-full transition-colors ${
                  activeTab === "users"
                    ? "bg-indigo-100 text-indigo-800 dark:bg-gray-700 dark:text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <UserGroupIcon className="h-5 w-5 mr-3" /> Users
              </button>
              <button
                onClick={() => setActiveTab("customers")}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg w-full transition-colors ${
                  activeTab === "customers"
                    ? "bg-indigo-100 text-indigo-800 dark:bg-gray-700 dark:text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <BuildingOfficeIcon className="h-5 w-5 mr-3" /> Customers
              </button>
              <button
                onClick={() => setActiveTab("invoices")}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg w-full transition-colors ${
                  activeTab === "invoices"
                    ? "bg-indigo-100 text-indigo-800 dark:bg-gray-700 dark:text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <DocumentCheckIcon className="h-5 w-5 mr-3" /> Invoices
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg w-full transition-colors ${
                  activeTab === "settings"
                    ? "bg-indigo-100 text-indigo-800 dark:bg-gray-700 dark:text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <Cog6ToothIcon className="h-5 w-5 mr-3" /> Settings
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
                <p className="text-sm font-medium text-gray-90 0 dark:text-white">
                  {userFullName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {storedUser?.role}
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
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden mr-2 text-gray-500 dark:text-gray-400"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {activeTab === "dashboard" && "Dashboard"}
                {activeTab === "users" && "User Management"}
                {activeTab === "customers" && "Customer Management"}
                {activeTab === "invoices" && "Invoice Management"}
                {activeTab === "settings" && "Settings"}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setIsRefreshing(true);
                  setTimeout(() => setIsRefreshing(false), 1000);
                }}
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
                    Welcome back, {userFullName} 👋
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
                    <PlusIcon className="h-4 w-4 mr-2" /> New Report
                  </button>
                </div>
              </div>

              {/* KPI Cards */}
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DataCard
                  title="Total Users"
                  value={users.length}
                  change={15}
                  icon={<UserGroupIcon />}
                  color="indigo"
                />
                <DataCard
                  title="Total Customers"
                  value={customers.length}
                  change={25}
                  icon={<BuildingOfficeIcon />}
                  color="blue"
                />
                <DataCard
                  title="Active Invoices"
                  value={invoices.filter((i) => i.status !== "paid").length}
                  change={20}
                  icon={<DocumentCheckIcon />}
                  color="green"
                />
                <DataCard
                  title="Monthly Revenue"
                  value={`$${monthlyRevenue.toLocaleString()}`}
                  change={10}
                  icon={<CurrencyDollarIcon />}
                  color="yellow"
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
                          legend: { display: false },
                          tooltip: { mode: "index", intersect: false },
                        },
                        hover: { mode: "nearest", intersect: true },
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
                            grid: { display: false },
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
                        plugins: { legend: { display: false } },
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
                            grid: { display: false },
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
                      <BellIcon className="h-5 w-5 mr-2 text-indigo-500" />{" "}
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

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="px-6 py-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    Employee Management
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Manage all employees and their permissions.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddUserModalOpen(true)}
                  className="mt-4 md:mt-0 px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium text-white hover:bg-indigo-700 transition-colors flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-2" /> Add New Employee
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
                          Employee
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Email
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
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Verified
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Created At
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
                      {filteredUsers.map((employee) => (
                        <tr
                          key={employee.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold uppercase">
                                {employee?.fullName
                                  ? employee.fullName
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                  : "?"}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {employee.fullName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {employee.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm capitalize text-gray-500 dark:text-gray-400">
                            {employee.role}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusPill status={employee.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {employee.verified ? "Yes" : "No"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(employee.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleViewUser(employee)}
                              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-3"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleEditUser(employee)}
                              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) =>
                                handleDeleteEmployee(e, employee.id)
                              }
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Customers Tab */}
          {activeTab === "customers" && (
            <div className="px-6 py-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    Customer Management
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Manage all your customers and their information.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddCustomerModalOpen(true)}
                  className="mt-4 md:mt-0 px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium text-white hover:bg-indigo-700 transition-colors flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-2" /> Add New Customer
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
                          Customer
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Phone
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
                      {filteredCustomers.map((customer) => (
                        <tr
                          key={customer.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Avatar name={customer.name} size="sm" />
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {customer.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  Added{" "}
                                  {new Date(
                                    customer.createdAt
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {customer.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {customer.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleViewCustomer(customer)}
                              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-3"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleEditCustomer(customer)}
                              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCustomer(customer.id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Invoices Tab */}
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
                <button
                  onClick={() => setIsAddInvoiceModalOpen(true)}
                  className="mt-4 md:mt-0 px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium text-white hover:bg-indigo-700 transition-colors flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-2" /> Create Invoice
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
                            {invoice.company && (
                              <div className="text-xs text-gray-400 dark:text-gray-500">
                                {invoice.company}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            ${Number(invoice?.amount)?.toFixed(2)}
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
                            <button
                              onClick={() => handleViewInvoice(invoice)}
                              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-3"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleEditInvoice(invoice)}
                              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteInvoice(invoice.id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
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
                  <form
                    onSubmit={handleSaveAccountSettings}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar
                        src={JSON.parse(localStorage.getItem("user"))?.avatar}
                        name={userFullName}
                        size="lg"
                      />
                      <div>
                        <button
                          type="button"
                          className="px-3 py-1.5 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                        >
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
                          className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          value={userFullName}
                          onChange={(e) => setUserFullName(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-7 00 dark:text-gray-300 mb-1"
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          defaultValue="admin@example.com"
                          required
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
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 rounded-md text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>

                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-8 00 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Change Password
                    </h2>
                    <form onSubmit={handleChangePassword} className="space-y-4">
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
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
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
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
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
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                      <div className="pt-2">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-indigo-600 rounded-md text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                        >
                          Update Password
                        </button>
                      </div>
                    </form>
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
                            className="block text-sm font-medium text-gray-7 00 dark:text-gray-300"
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
      {/* Add user modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Add New Employee
            </h2>
            <form onSubmit={handleAddEmployee} className="space-y-4">
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
                  value={newUserForm.fullName}
                  onChange={(e) =>
                    setNewUserForm({ ...newUserForm, fullName: e.target.value })
                  }
                  required
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={newUserForm.email}
                  onChange={(e) =>
                    setNewUserForm({ ...newUserForm, email: e.target.value })
                  }
                  required
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={newUserForm.password}
                  onChange={(e) =>
                    setNewUserForm({ ...newUserForm, password: e.target.value })
                  }
                  required
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Role
                </label>
                <select
                  id="role"
                  value={newUserForm.role}
                  onChange={(e) =>
                    setNewUserForm({ ...newUserForm, role: e.target.value })
                  }
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="subscriber">Subscriber</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Status
                </label>
                <select
                  id="status"
                  value={newUserForm.status}
                  onChange={(e) =>
                    setNewUserForm({ ...newUserForm, status: e.target.value })
                  }
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="avatar"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Avatar URL (optional)
                </label>
                <input
                  type="text"
                  id="avatar"
                  value={newUserForm.avatar}
                  onChange={(e) =>
                    setNewUserForm({ ...newUserForm, avatar: e.target.value })
                  }
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 rounded-md text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                >
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {isAddCustomerModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Add New Customer
            </h2>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <label
                  htmlFor="customerName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="customerName"
                  value={newCustomerForm.name}
                  onChange={(e) =>
                    setNewCustomerForm({
                      ...newCustomerForm,
                      name: e.target.value,
                    })
                  }
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="customerEmail"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="customerEmail"
                  value={newCustomerForm.email}
                  onChange={(e) =>
                    setNewCustomerForm({
                      ...newCustomerForm,
                      email: e.target.value,
                    })
                  }
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={newCustomerForm.phone}
                  onChange={(e) =>
                    setNewCustomerForm({
                      ...newCustomerForm,
                      phone: e.target.value,
                    })
                  }
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
                />
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Address
                </label>
                <textarea
                  id="address"
                  value={newCustomerForm.address}
                  onChange={(e) =>
                    setNewCustomerForm({
                      ...newCustomerForm,
                      address: e.target.value,
                    })
                  }
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
                  rows={3}
                />
              </div>

              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Type
                </label>
                <select
                  id="type"
                  value={newCustomerForm.type}
                  onChange={(e) =>
                    setNewCustomerForm({
                      ...newCustomerForm,
                      type: e.target.value,
                    })
                  }
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="individual">Individual</option>
                  <option value="company">Company</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddCustomerModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 rounded-md text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Add Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Invoice Modal */}
      {isAddInvoiceModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Create New Invoice
            </h2>
            <form onSubmit={handleAddInvoice} className="space-y-4">
              <div>
                <label
                  htmlFor="invoiceCustomer"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Customer
                </label>
                <select
                  id="invoiceCustomer"
                  value={newInvoiceForm.customerId}
                  onChange={(e) =>
                    setNewInvoiceForm({
                      ...newInvoiceForm,
                      customerId: e.target.value,
                    })
                  }
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select a customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} ({customer.company})
                    </option>
                  ))}
                </select>
              </div>
              {!newInvoiceForm.customerId && (
                <div>
                  <label
                    htmlFor="client"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Or enter client name manually
                  </label>
                  <input
                    type="text"
                    id="client"
                    value={newInvoiceForm.client}
                    onChange={(e) =>
                      setNewInvoiceForm({
                        ...newInvoiceForm,
                        client: e.target.value,
                      })
                    }
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-6 00 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              )}
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  value={newInvoiceForm.amount}
                  onChange={(e) =>
                    setNewInvoiceForm({
                      ...newInvoiceForm,
                      amount: e.target.value,
                    })
                  }
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Status
                </label>
                <select
                  id="status"
                  value={newInvoiceForm.status}
                  onChange={(e) =>
                    setNewInvoiceForm({
                      ...newInvoiceForm,
                      status: e.target.value,
                    })
                  }
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="dueDate"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  value={newInvoiceForm.dueDate}
                  onChange={(e) =>
                    setNewInvoiceForm({
                      ...newInvoiceForm,
                      dueDate: e.target.value,
                    })
                  }
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="issuedDate"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Issued Date
                </label>
                <input
                  type="date"
                  id="issuedDate"
                  value={newInvoiceForm.issuedDate}
                  onChange={(e) =>
                    setNewInvoiceForm({
                      ...newInvoiceForm,
                      issuedDate: e.target.value,
                    })
                  }
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddInvoiceModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 rounded-md text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                >
                  Create Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Employee Modal */}
      {isViewUserModalOpen && currentUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Employee Details
              </h2>
              <button
                onClick={() => setIsViewUserModalOpen(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className="h-12 w-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-bold uppercase">
                {(currentUser.fullName || "")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {currentUser.fullName}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {currentUser.email}
                </p>
                <div className="mt-2">
                  <StatusPill status={currentUser.status} />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Role:</span>
                <span className="font-medium text-gray-900 dark:text-white capitalize">
                  {currentUser.role}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Permissions:
                </span>
                <div className="text-right">
                  {Object.entries(
                    typeof currentUser.permissions === "string"
                      ? JSON.parse(currentUser.permissions)
                      : currentUser.permissions || {}
                  )
                    .filter(([_, value]) => value)
                    .map(([key]) => (
                      <span
                        key={key}
                        className="inline-block bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300 mr-1 mb-1 capitalize"
                      >
                        {key}
                      </span>
                    ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setIsViewUserModalOpen(false);
                  setIsEditUserModalOpen(true);
                }}
                className="px-4 py-2 bg-indigo-600 rounded-md text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
              >
                Edit Employee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {isEditUserModalOpen && currentUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Edit Employee
              </h2>
              <button
                onClick={() => setIsEditUserModalOpen(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSaveEditEmployee} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={currentUser.fullName}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, fullName: e.target.value })
                  }
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={currentUser.email}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, email: e.target.value })
                  }
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <select
                  value={currentUser.role}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, role: e.target.value })
                  }
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="subscriber">Subscriber</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={currentUser.status}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, status: e.target.value })
                  }
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              {/* Permissions (basic checkbox list example) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Permissions
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["invoices", "customers", "reports", "settings"].map(
                    (perm) => (
                      <label
                        key={perm}
                        className="flex items-center space-x-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={
                            (typeof currentUser.permissions === "string"
                              ? JSON.parse(currentUser.permissions)
                              : currentUser.permissions || {})[perm] || false
                          }
                          onChange={(e) => {
                            const updatedPerms = {
                              ...JSON.parse(currentUser.permissions || "{}"),
                              [perm]: e.target.checked,
                            };
                            setCurrentUser({
                              ...currentUser,
                              permissions: JSON.stringify(updatedPerms),
                            });
                          }}
                        />
                        <span className="text-gray-700 dark:text-gray-300 capitalize">
                          {perm}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditUserModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 rounded-md text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isViewCustomerModalOpen && currentCustomer && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Customer Details
              </h2>
              <button
                onClick={() => setIsViewCustomerModalOpen(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <Avatar name={currentCustomer.name} size="lg" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {currentCustomer.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 capitalize">
                  {currentCustomer.type}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Email:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {currentCustomer.email || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {currentCustomer.phone || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Address:
                </span>
                <span className="font-medium text-gray-900 dark:text-white text-right">
                  {currentCustomer.address || "N/A"}
                </span>
              </div>
              {currentCustomer.createdAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Member Since:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(currentCustomer.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsViewCustomerModalOpen(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsViewCustomerModalOpen(false);
                  setIsEditCustomerModalOpen(true);
                }}
                className="px-4 py-2 bg-indigo-600 rounded-md text-sm font-medium text-white hover:bg-indigo-700"
              >
                Edit Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditCustomerModalOpen && currentCustomer && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Edit Customer
              </h2>
              <button
                onClick={() => setIsEditCustomerModalOpen(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedCustomer} className="space-y-4">
              <div>
                <label
                  htmlFor="editCustomerName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="editCustomerName"
                  value={currentCustomer.name}
                  onChange={(e) =>
                    setCurrentCustomer({
                      ...currentCustomer,
                      name: e.target.value,
                    })
                  }
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="editType"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Type
                </label>
                <select
                  id="editType"
                  value={currentCustomer.type}
                  onChange={(e) =>
                    setCurrentCustomer({
                      ...currentCustomer,
                      type: e.target.value,
                    })
                  }
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="individual">Individual</option>
                  <option value="company">Company</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="editCustomerEmail"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="editCustomerEmail"
                  value={currentCustomer.email}
                  onChange={(e) =>
                    setCurrentCustomer({
                      ...currentCustomer,
                      email: e.target.value,
                    })
                  }
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="editPhone"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Phone
                </label>
                <input
                  type="tel"
                  id="editPhone"
                  value={currentCustomer.phone}
                  onChange={(e) =>
                    setCurrentCustomer({
                      ...currentCustomer,
                      phone: e.target.value,
                    })
                  }
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="editAddress"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Address
                </label>
                <textarea
                  id="editAddress"
                  value={currentCustomer.address}
                  onChange={(e) =>
                    setCurrentCustomer({
                      ...currentCustomer,
                      address: e.target.value,
                    })
                  }
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditCustomerModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 rounded-md text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Invoice Modal */}
      {isViewInvoiceModalOpen && currentInvoice && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Invoice Details
              </h2>
              <button
                onClick={() => setIsViewInvoiceModalOpen(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Invoice #{currentInvoice.id}
                  </h3>
                  <StatusPill status={currentInvoice.status} />
                </div>
                <div className="text-right">
                  <p className="text-gray-600 dark:text-gray-400">
                    Issued: {currentInvoice.issuedDate}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Due: {currentInvoice.dueDate}
                  </p>
                </div>
              </div>

              <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 my-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    Client:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {currentInvoice.client}
                  </span>
                </div>
                {currentInvoice.company && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Company:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {currentInvoice.company}
                    </span>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <div className="flex justify-between font-bold text-gray-900 dark:text-white">
                  <span>Amount:</span>
                  <span>${Number(currentInvoice.amount).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsViewInvoiceModalOpen(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsViewInvoiceModalOpen(false);
                  setIsEditInvoiceModalOpen(true);
                }}
                className="px-4 py-2 bg-indigo-600 rounded-md text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
              >
                Edit Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Invoice Modal */}
      {isEditInvoiceModalOpen && currentInvoice && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Edit Invoice
              </h2>
              <button
                onClick={() => setIsEditInvoiceModalOpen(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedInvoice} className="space-y-4">
              <div>
                <label
                  htmlFor="editInvoiceClient"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Client
                </label>
                <select
                  id="editInvoiceClient"
                  value={currentInvoice.customerId || ""}
                  onChange={(e) =>
                    setCurrentInvoice({
                      ...currentInvoice,
                      customerId: e.target.value,
                    })
                  }
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select a customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} ({customer.company})
                    </option>
                  ))}
                </select>
              </div>

              {!currentInvoice.customerId && (
                <div>
                  <label
                    htmlFor="editClientName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Or enter client name manually
                  </label>
                  <input
                    type="text"
                    id="editClientName"
                    value={currentInvoice.client}
                    onChange={(e) =>
                      setCurrentInvoice({
                        ...currentInvoice,
                        client: e.target.value,
                      })
                    }
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="editAmount"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Amount
                </label>
                <input
                  type="number"
                  id="editAmount"
                  value={currentInvoice.amount}
                  onChange={(e) =>
                    setCurrentInvoice({
                      ...currentInvoice,
                      amount: e.target.value,
                    })
                  }
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="editStatus"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Status
                </label>
                <select
                  id="editStatus"
                  value={currentInvoice.status}
                  onChange={(e) =>
                    setCurrentInvoice({
                      ...currentInvoice,
                      status: e.target.value,
                    })
                  }
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="editDueDate"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Due Date
                </label>
                <input
                  type="date"
                  id="editDueDate"
                  value={currentInvoice.dueDate}
                  onChange={(e) =>
                    setCurrentInvoice({
                      ...currentInvoice,
                      dueDate: e.target.value,
                    })
                  }
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="editIssuedDate"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Issued Date
                </label>
                <input
                  type="date"
                  id="editIssuedDate"
                  value={currentInvoice.issuedDate}
                  onChange={(e) =>
                    setCurrentInvoice({
                      ...currentInvoice,
                      issuedDate: e.target.value,
                    })
                  }
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditInvoiceModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 rounded-md text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
