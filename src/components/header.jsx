import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
} from "@heroicons/react/24/outline";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [activeHover, setActiveHover] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const mobileMenuRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const navRef = useRef(null);

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
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target) &&
        !event.target.closest(".profile-button")
      ) {
        setProfileDropdownOpen(false);
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setProfileDropdownOpen(false);
    navigate("/");
  };

  const markNotificationAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const handleProfileClick = () => {
    if (window.innerWidth < 768) {
      setProfileDropdownOpen(!profileDropdownOpen);
    } else {
      navigate("/admin");
    }
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

          <Link to="/" className="text-2xl font-bold flex items-center group">
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

          {/* Notifications */}
          {isLoggedIn && (
            <div className="relative">
              <motion.button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileDropdownOpen(false);
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
                            className={`block px-4 py-3 text-sm hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors duration-300 ${
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
            <div className="flex items-center space-x-3">
              {/* Profile button */}
              <div className="relative">
                <motion.button
                  onClick={handleProfileClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 focus:outline-none profile-button"
                  aria-label="User profile"
                >
                  <div className="h-9 w-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
                    <UserIcon className="h-5 w-5 text-white" />
                  </div>
                  <span className="hidden lg:inline text-sm font-medium text-gray-700 dark:text-gray-300">
                    {JSON.parse(localStorage.getItem("user"))?.name ||
                      "Profile"}
                  </span>
                  <ChevronDownIcon className="hidden lg:block h-4 w-4 text-gray-500 dark:text-gray-400" />
                </motion.button>

                {/* Mobile Profile Dropdown */}
                {profileDropdownOpen && window.innerWidth < 768 && (
                  <motion.div
                    ref={profileDropdownRef}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden z-50 border border-gray-200/50 dark:border-gray-700/30 backdrop-blur-md"
                  >
                    <div className="py-1">
                      <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/30 bg-gray-50/50 dark:bg-gray-700/30">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Signed in as
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {JSON.parse(localStorage.getItem("user"))?.email ||
                            "User"}
                        </p>
                      </div>
                      <Link
                        to="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors duration-300 flex items-center"
                      >
                        <HomeIcon className="h-4 w-4 mr-2.5" />
                        Dashboard
                      </Link>
                      <Link
                        to="/admin/invoices"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors duration-300 flex items-center"
                      >
                        <DocumentTextIcon className="h-4 w-4 mr-2.5" />
                        Invoices
                      </Link>
                      <Link
                        to="/admin/reports"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors duration-300 flex items-center"
                      >
                        <ChartBarIcon className="h-4 w-4 mr-2.5" />
                        Reports
                      </Link>
                      <Link
                        to="/admin/settings"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors duration-300 flex items-center"
                      >
                        <Cog6ToothIcon className="h-4 w-4 mr-2.5" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-gray-700/50 transition-colors duration-300 flex items-center"
                      >
                        <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-2.5" />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
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

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-900/95 shadow-lg z-40 border-t border-gray-200/50 dark:border-gray-700/30 backdrop-blur-md"
          >
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
            {!isLoggedIn ? (
              <div className="pt-4 pb-3 border-t border-gray-200/50 dark:border-gray-700/30">
                <div className="flex items-center px-5 space-x-3">
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
                    className="w-full px-4 py-3 text-center text-indigo-600 dark:text-indigo-400 font-medium rounded-lg border border-indigo-600 dark:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-gray-800/50 transition-colors duration-300"
                  >
                    Login
                  </Link>
                </div>
              </div>
            ) : (
              <div className="pt-4 pb-3 border-t border-gray-200/50 dark:border-gray-700/30">
                <div className="flex items-center px-5">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
                    <UserIcon className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-900 dark:text-white">
                      {JSON.parse(localStorage.getItem("user"))?.name || "User"}
                    </div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {JSON.parse(localStorage.getItem("user"))?.email ||
                        "email@example.com"}
                    </div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-3 rounded-lg text-base font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors duration-300"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/invoices"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-3 rounded-lg text-base font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors duration-300"
                  >
                    Invoices
                  </Link>
                  <Link
                    to="/admin/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-3 rounded-lg text-base font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors duration-300"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-3 py-3 rounded-lg text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-gray-800/50 transition-colors duration-300"
                  >
                    Sign out
                  </button>
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
