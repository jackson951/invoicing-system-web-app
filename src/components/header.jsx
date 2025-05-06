import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const navigate = useNavigate();
  const location = useLocation();
  const mobileMenuRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  // Mock notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: "New invoice received",
      read: false,
      time: "2 mins ago",
      link: "/invoices/1",
    },
    {
      id: 2,
      text: "Payment confirmed",
      read: false,
      time: "1 hour ago",
      link: "/payments/1",
    },
    {
      id: 3,
      text: "System update available",
      read: true,
      time: "1 day ago",
      link: "/settings",
    },
  ]);

  // Check auth status
  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!(user && token));
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
    localStorage.removeItem("user");
    localStorage.removeItem("token");
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
      // Mobile devices
      setProfileDropdownOpen(!profileDropdownOpen);
    } else {
      // Desktop devices
      navigate("/admin");
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 transition-all duration-300 ${
        scrolled ? "shadow-md py-2" : "py-4"
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
            className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center"
          >
            <DocumentTextIcon className="h-8 w-8 mr-2" />
            InvoicePro
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link
            to="/features"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              location.pathname === "/features"
                ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-gray-800"
                : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            }`}
          >
            Features
          </Link>
          <Link
            to="/pricing"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              location.pathname === "/pricing"
                ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-gray-800"
                : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            }`}
          >
            Pricing
          </Link>
          <Link
            to="/testimonials"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              location.pathname === "/testimonials"
                ? "text-indigo-600 dark:text indigo-400 bg-indigo-50 dark:bg-gray-800"
                : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            }`}
          >
            Testimonials
          </Link>
          <Link
            to="/faq"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              location.pathname === "/faq"
                ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-gray-800"
                : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            }`}
          >
            FAQ
          </Link>
        </nav>

        {/* Auth & Theme Toggle Buttons */}
        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors duration-200"
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {darkMode ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>

          {/* Notifications */}
          {isLoggedIn && (
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileDropdownOpen(false);
                }}
                className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors duration-200 relative notifications-button"
                aria-label="Notifications"
              >
                <BellIcon className="h-5 w-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div
                  ref={notificationsRef}
                  className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-50 border border-gray-200 dark:border-gray-700"
                >
                  <div className="py-1">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
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
                          className={`block px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
                            notification.read
                              ? "text-gray-600 dark:text-gray-400"
                              : "text-gray-900 dark:text-white font-medium"
                          }`}
                        >
                          <div className="flex justify-between">
                            <span>{notification.text}</span>
                            {!notification.read && (
                              <span className="h-2 w-2 rounded-full bg-indigo-500 inline-block"></span>
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
                    <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 text-center">
                      <Link
                        to="/notifications"
                        onClick={() => setNotificationsOpen(false)}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Profile & Login/Logout */}
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              {/* Profile button */}
              <div className="relative">
                <button
                  onClick={handleProfileClick}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none profile-button"
                  aria-label="User profile"
                >
                  <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-300">
                    {JSON.parse(localStorage.getItem("user"))?.name ||
                      "Profile"}
                  </span>
                </button>

                {/* Mobile Profile Dropdown */}
                {profileDropdownOpen && window.innerWidth < 768 && (
                  <div
                    ref={profileDropdownRef}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-50 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Signed in as
                        </p>
                        <p className="text-sm font-medium text-gray-9 00 dark:text-white truncate">
                          {JSON.parse(localStorage.getItem("user"))?.email ||
                            "User"}
                        </p>
                      </div>
                      <Link
                        to="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <div className="flex items-center">
                          <HomeIcon className="h-4 w-4 mr-2" />
                          Dashboard
                        </div>
                      </Link>
                      <Link
                        to="/admin/invoices"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <div className="flex items-center">
                          <DocumentTextIcon className="h-4 w-4 mr-2" />
                          Invoices
                        </div>
                      </Link>
                      <Link
                        to="/admin/reports"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-7 00 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <div className="flex items-center">
                          <ChartBarIcon className="h-4 w-4 mr-2" />
                          Reports
                        </div>
                      </Link>
                      <Link
                        to="/admin/settings"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <div className="flex items-center">
                          <Cog6ToothIcon className="h-4 w-4 mr-2" />
                          Settings
                        </div>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <div className="flex items-center">
                          <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-2" />
                          Sign out
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop Logout Button - Always visible on larger screens */}
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors duration-200"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-1" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="px-3 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-7 00 text-white text-sm font-medium rounded-md transition-colors duration-200"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-lg z-40 border-t border-gray-200 dark:border-gray-800"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/features"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === "/features"
                  ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-gray-800"
                  : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              Features
            </Link>
            <Link
              to="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === "/pricing"
                  ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-gray-800"
                  : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              Pricing
            </Link>
            <Link
              to="/testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === "/testimonials"
                  ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-gray-800"
                  : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              Testimonials
            </Link>
            <Link
              to="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === "/faq"
                  ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-gray-800"
                  : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              FAQ
            </Link>
          </div>
          {!isLoggedIn && (
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center px-5 space-x-3">
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full px-4 py-2 text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors duration-200"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full px-4 py-2 text-center text-indigo-600 dark:text-indigo-400 font-medium rounded-md border border-indigo-600 dark:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  Login
                </Link>
              </div>
            </div>
          )}
          {isLoggedIn && (
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800 dark:text-white">
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
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/invoices"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  Invoices
                </Link>
                <Link
                  to="/admin/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
