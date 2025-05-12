import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useActiveTab } from "../contexts/ActiveTabContext";
import { useAuth } from "../contexts/AuthContext";
import {
  UserIcon,
  MoonIcon,
  SunIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon,
  Cog6ToothIcon,
  HomeIcon,
  DocumentTextIcon,
  ChartBarIcon,
  BellIcon,
  ChevronDownIcon,
  SparklesIcon,
  UsersIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [activeHover, setActiveHover] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const mobileMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const navRef = useRef(null);
  const { activeTab, setActiveTab } = useActiveTab();
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  // Sync active tab with URL path
  useEffect(() => {
    const pathParts = location.pathname.split("/");
    if (pathParts[1] === "admin" && pathParts[2]) {
      setActiveTab(pathParts[2]);
    }
  }, [location.pathname, setActiveTab]);

  // Mock notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: "New invoice received from Acme Corp",
      read: false,
      time: "2 mins ago",
      link: "/invoices/1",
    },
    {
      id: 2,
      text: "Payment of $1,250 confirmed",
      read: false,
      time: "1 hour ago",
      link: "/payments/1",
    },
    {
      id: 3,
      text: "System update available (v2.3.1)",
      read: true,
      time: "1 day ago",
      link: "/settings",
    },
  ]);

  // Check auth status
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, [navigate, location]);

  // Handle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest(".mobile-menu-button")
      ) {
        setMobileMenuOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target) &&
        !event.target.closest(".notifications-button")
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setActiveTab("dashboard");
    setIsLoggedIn(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  const markNotificationAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const handleAdminNavigation = (tab = "dashboard") => {
    setActiveTab(tab);
    navigate(`/admin`);
    setMobileMenuOpen(false);
  };

  // Navigation items
  const navItems = [
    { name: "Features", path: "/features" },
    { name: "Pricing", path: "/pricing" },
    { name: "Testimonials", path: "/testimonials" },
    { name: "FAQ", path: "/faq" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm py-2 border-b border-gray-200/50 dark:border-gray-700/30"
          : "bg-white dark:bg-gray-900 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
        {/* Logo and mobile menu button */}
        <div className="flex items-center">
          <button
            className="md:hidden mr-4 p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>

          <Link
            to="/"
            className="text-2xl font-bold flex items-center group"
            onClick={() => setActiveTab("dashboard")}
          >
            <motion.div whileHover={{ rotate: 15 }} className="relative">
              <DocumentTextIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mr-2" />
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -top-2 -right-2"
              >
                <SparklesIcon className="h-4 w-4 text-yellow-500" />
              </motion.span>
            </motion.div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 group-hover:from-indigo-700 group-hover:to-purple-700 transition-all duration-300">
              QuantumInvoicer
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav ref={navRef} className="hidden md:flex space-x-1 relative">
          {navItems.map((item) => (
            <motion.div
              key={item.path}
              onHoverStart={() => setActiveHover(item.path)}
              onHoverEnd={() => setActiveHover(null)}
              className="relative"
            >
              <Link
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                  location.pathname === item.path
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                }`}
              >
                {item.name}
              </Link>
              {activeHover === item.path && (
                <motion.div
                  layoutId="navHover"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.div>
          ))}
        </nav>

        {/* Auth & Theme Toggle Buttons */}
        <div className="flex items-center space-x-3">
          {/* Dark Mode Toggle */}
          <motion.button
            onClick={() => setDarkMode(!darkMode)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none transition-all duration-300"
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {darkMode ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </motion.button>

          {/* Notifications - Only visible when logged in */}
          {isLoggedIn && (
            <div className="relative">
              <motion.button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none transition-all duration-300 relative notifications-button"
                aria-label="Notifications"
              >
                <BellIcon className="h-5 w-5" />
                {unreadNotificationsCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                  >
                    {unreadNotificationsCount}
                  </motion.span>
                )}
              </motion.button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    ref={notificationsRef}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden z-50 border border-gray-200/50 dark:border-gray-700/30 backdrop-blur-md"
                  >
                    <div className="py-1">
                      <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/30 bg-gray-50/50 dark:bg-gray-700/30">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Notifications
                        </p>
                      </div>
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <Link
                            key={notification.id}
                            to={notification.link}
                            onClick={() => {
                              markNotificationAsRead(notification.id);
                              setNotificationsOpen(false);
                            }}
                            className={`block px-4 py-3 text-sm hover:bg-gray-100/50 dark:hover:bg-gray-7/50 transition-colors duration-300 ${
                              notification.read
                                ? "text-gray-600 dark:text-gray-400"
                                : "text-gray-900 dark:text-white font-medium"
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <span>{notification.text}</span>
                              {!notification.read && (
                                <span className="h-2 w-2 rounded-full bg-indigo-500 mt-1.5"></span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {notification.time}
                            </p>
                          </Link>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                          No notifications
                        </div>
                      )}
                      <div className="px-4 py-2 border-t border-gray-200/50 dark:border-gray-700/30 text-center">
                        <Link
                          to="/notifications"
                          onClick={() => setNotificationsOpen(false)}
                          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                        >
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Profile & Login/Logout */}
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              {/* Profile button */}
              <motion.button
                onClick={() => handleAdminNavigation("dashboard")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 focus:outline-none"
                aria-label="User profile"
              >
                <div className="h-9 w-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
                  <UserIcon className="h-5 w-5 text-white" />
                </div>
                <span className="hidden lg:inline text-sm font-medium text-gray-700 dark:text-gray-300">
                  {JSON.parse(localStorage.getItem("user"))?.fullName ||
                    "Profile"}
                </span>
              </motion.button>

              {/* Logout button with text on larger screens */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center"
              >
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 hover:bg-red-100/50 dark:hover:bg-red-900/30 focus:outline-none transition-all duration-300"
                  aria-label="Logout"
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                  <span className="hidden md:inline text-sm font-medium">
                    Sign Out
                  </span>
                </button>
              </motion.div>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-300"
              >
                Login
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/register")}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-300"
              >
                Get Started
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu - slides from left for logged-in users */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{
              opacity: 0,
              x: isLoggedIn ? -300 : 0,
              y: !isLoggedIn ? -20 : 0,
            }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{
              opacity: 0,
              x: isLoggedIn ? -300 : 0,
              y: !isLoggedIn ? -20 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: isLoggedIn ? undefined : 0.2,
            }}
            className={`md:hidden fixed top-0 ${
              isLoggedIn ? "left-0 bottom-0 w-72" : "left-0 right-0"
            } bg-white/95 dark:bg-gray-900/95 shadow-xl z-50 border-r border-gray-200/50 dark:border-gray-700/30 backdrop-blur-md`}
          >
            {isLoggedIn ? (
              <div className="h-full flex flex-col">
                {/* Header with close button */}
                <div className="px-4 py-5 border-b border-gray-200/50 dark:border-gray-700/30 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
                      <UserIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-3">
                      <div className="text-lg font-medium text-gray-900 dark:text-white">
                        {JSON.parse(localStorage.getItem("user"))?.fullName ||
                          "User"}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {JSON.parse(localStorage.getItem("user"))?.email ||
                          "email@example.com"}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                    aria-label="Close menu"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Navigation items */}
                <div className="flex-1 overflow-y-auto py-4 px-2">
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        handleAdminNavigation("dashboard");
                      }}
                      className={`w-full text-left flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors duration-300 ${
                        activeTab === "dashboard"
                          ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-gray-800/50"
                          : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                      }`}
                    >
                      <HomeIcon className="h-5 w-5 mr-3" />
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        handleAdminNavigation("invoices");
                      }}
                      className={`w-full text-left flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors duration-300 ${
                        activeTab === "invoices"
                          ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-gray-800/50"
                          : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                      }`}
                    >
                      <DocumentTextIcon className="h-5 w-5 mr-3" />
                      Invoices
                    </button>
                    <button
                      onClick={() => {
                        handleAdminNavigation("users");
                      }}
                      className={`w-full text-left flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors duration-300 ${
                        activeTab === "users"
                          ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-gray-800/50"
                          : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                      }`}
                    >
                      <UserGroupIcon className="h-5 w-5 mr-3" />
                      Employees
                    </button>
                    <button
                      onClick={() => {
                        handleAdminNavigation("customers");
                      }}
                      className={`w-full text-left flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors duration-300 ${
                        activeTab === "customers"
                          ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-gray-800/50"
                          : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                      }`}
                    >
                      <UsersIcon className="h-5 w-5 mr-3" />
                      Customers
                    </button>
                    <button
                      onClick={() => {
                        handleAdminNavigation("settings");
                      }}
                      className={`w-full text-left flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors duration-300 ${
                        activeTab === "settings"
                          ? "text indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-gray-800/50"
                          : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                      }`}
                    >
                      <Cog6ToothIcon className="h-5 w-5 mr-3" />
                      Settings
                    </button>
                  </div>
                </div>

                {/* Footer with logout button */}
                <div className="px-4 py-4 border-t border-gray-200/50 dark:border-gray-700/30">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center px-4 py-2.5 bg-red-50/50 dark:bg-gray-800/50 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100/50 dark:hover:bg-gray-700/50 transition-colors duration-300"
                  >
                    <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-3 py-3 rounded-lg text-base font-medium transition-colors duration-300 ${
                        location.pathname === item.path
                          ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-gray-800/50"
                          : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="pt-4 pb-3 border-t border-gray-200/50 dark:border-gray-700/30">
                  <div className="px-5 space-y-3">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        navigate("/register");
                        setMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 text-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-sm transition-all duration-300"
                    >
                      Get Started
                    </motion.button>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full px-4 py-3 text-center text-indigo-600 dark:text-indigo-400 font-medium rounded-lg border border-indigo-600 dark:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-gray-800/50 transition-colors duration-300"
                    >
                      Login
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
