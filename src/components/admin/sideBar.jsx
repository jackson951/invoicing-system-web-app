import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  DocumentDuplicateIcon,
  CogIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline"; // Using Heroicons for icons

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isUsersSubMenuOpen, setIsUsersSubMenuOpen] = useState(false);
  const [isInvoiceSubMenuOpen, setIsInvoiceSubMenuOpen] = useState(false);

  const toggleUsersSubMenu = () => {
    setIsUsersSubMenuOpen(!isUsersSubMenuOpen);
  };

  const toggleInvoiceSubMenu = () => {
    setIsInvoiceSubMenuOpen(!isInvoiceSubMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isActiveSubMenu = (parentPath, subPath) => {
    return (
      location.pathname.startsWith(parentPath) &&
      location.pathname.includes(subPath)
    );
  };

  return (
    <aside className="w-64 bg-gray-50 dark:bg-gray-800 shadow-md h-screen sticky top-0 overflow-y-auto">
      <div className="p-6 text-center font-bold text-lg text-indigo-600 dark:text-indigo-400 border-b dark:border-gray-700">
        Admin Panel
      </div>
      <nav className="mt-4">
        <ul className="space-y-1 px-2">
          <li>
            <Link
              to="/admin"
              className={`flex items-center py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                isActive("/admin")
                  ? "bg-indigo-100 dark:bg-indigo-700 text-indigo-600 dark:text-indigo-400 font-medium"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              <HomeIcon className="h-5 w-5 mr-3" />
              Dashboard
            </Link>
          </li>

          <li>
            <div className="border-t dark:border-gray-700 my-2"></div>
          </li>

          <li>
            <div
              onClick={toggleUsersSubMenu}
              className={`flex items-center justify-between py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer ${
                location.pathname.startsWith("/admin/users")
                  ? "bg-indigo-100 dark:bg-indigo-700 text-indigo-600 dark:text-indigo-400 font-medium"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              <div className="flex items-center">
                <UsersIcon className="h-5 w-5 mr-3" />
                Manage Users
              </div>
              {isUsersSubMenuOpen ? (
                <ChevronDownIcon className="h-5 w-5" />
              ) : (
                <ChevronRightIcon className="h-5 w-5" />
              )}
            </div>
            {isUsersSubMenuOpen && (
              <ul className="space-y-1 pl-6 mt-1">
                <li>
                  <Link
                    to="/admin/users"
                    className={`block py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                      isActive("/admin/users")
                        ? "bg-indigo-100 dark:bg-indigo-700 text-indigo-600 dark:text-indigo-400 font-medium"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    All Users
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/users/create"
                    className={`block py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                      isActive("/admin/users/create")
                        ? "bg-indigo-100 dark:bg-indigo-700 text-indigo-600 dark:text-indigo-400 font-medium"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Add New User
                  </Link>
                </li>
                {/* Add more user-related sub-links here */}
              </ul>
            )}
          </li>

          <li>
            <div
              onClick={toggleInvoiceSubMenu}
              className={`flex items-center justify-between py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer ${
                location.pathname.startsWith("/admin/invoices")
                  ? "bg-indigo-100 dark:bg-indigo-700 text-indigo-600 dark:text-indigo-400 font-medium"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              <div className="flex items-center">
                <DocumentDuplicateIcon className="h-5 w-5 mr-3" />
                Invoices
              </div>
              {isInvoiceSubMenuOpen ? (
                <ChevronDownIcon className="h-5 w-5" />
              ) : (
                <ChevronRightIcon className="h-5 w-5" />
              )}
            </div>
            {isInvoiceSubMenuOpen && (
              <ul className="space-y-1 pl-6 mt-1">
                <li>
                  <Link
                    to="/admin/invoices"
                    className={`block py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                      isActive("/admin/invoices")
                        ? "bg-indigo-100 dark:bg-indigo-700 text-indigo-600 dark:text-indigo-400 font-medium"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    All Invoices
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/invoices/create"
                    className={`block py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                      isActive("/admin/invoices/create")
                        ? "bg-indigo-100 dark:bg-indigo-700 text-indigo-600 dark:text-indigo-400 font-medium"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Create Invoice
                  </Link>
                </li>
                {/* Add more invoice-related sub-links here */}
              </ul>
            )}
          </li>

          <li>
            <Link
              to="/admin/settings"
              className={`flex items-center py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                isActive("/admin/settings")
                  ? "bg-indigo-100 dark:bg-indigo-700 text-indigo-600 dark:text-indigo-400 font-medium"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              <CogIcon className="h-5 w-5 mr-3" />
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
