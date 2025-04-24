import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-indigo-600 text-white py-4 px-6 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Brand */}
        <Link to="/" className="text-2xl font-extrabold tracking-tight">
          Bill Flow
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="hover:text-indigo-200 transition">
            Home
          </Link>
          <Link to="/features" className="hover:text-indigo-200 transition">
            Features
          </Link>
          <Link to="/pricing" className="hover:text-indigo-200 transition">
            Pricing
          </Link>
          <Link to="/login" className="hover:text-indigo-200 transition">
            Login
          </Link>
          <Link
            to="/register"
            className="bg-white text-indigo-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition"
          >
            Get Started
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-indigo-700 px-6 py-4 space-y-3 text-sm">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block hover:text-indigo-200"
          >
            Home
          </Link>
          <Link
            to="/features"
            onClick={() => setMenuOpen(false)}
            className="block hover:text-indigo-200"
          >
            Features
          </Link>
          <Link
            to="/pricing"
            onClick={() => setMenuOpen(false)}
            className="block hover:text-indigo-200"
          >
            Pricing
          </Link>
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="block hover:text-indigo-200"
          >
            Login
          </Link>
          <Link
            to="/register"
            onClick={() => setMenuOpen(false)}
            className="block bg-white text-indigo-600 px-4 py-2 rounded-md text-center hover:bg-gray-100"
          >
            Get Started
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;
