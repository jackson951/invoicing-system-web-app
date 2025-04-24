import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-indigo-600 text-white py-4 px-6 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Smart Invoicing
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:text-indigo-200 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-indigo-200 transition">
                Register
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-indigo-200 transition">
                Login
              </Link>
            </li>
            {/* Add more navigation links as needed */}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
