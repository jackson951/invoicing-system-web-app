import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      {/* Floating Navigation */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${
          scrolled ? "shadow-md py-2" : "py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
          <div className="flex items-center">
            {/* Make InvoicePro a navigation link to the homepage */}
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              InvoicePro
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            {/* Use Link for section navigation */}
            <Link
              to="/#features"
              className="text-gray-600 hover:text-indigo-600 transition"
            >
              Features
            </Link>
            <Link
              to="/#pricing"
              className="text-gray-600 hover:text-indigo-600 transition"
            >
              Pricing
            </Link>
            <Link
              to="/#testimonials"
              className="text-gray-600 hover:text-indigo-600 transition"
            >
              Testimonials
            </Link>
            <Link
              to="/#faq"
              className="text-gray-600 hover:text-indigo-600 transition"
            >
              FAQ
            </Link>
          </nav>
          <div className="flex space-x-4">
            <Link
              to="/login"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
