import React from "react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 px-4 md:px-12 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Company Info */}
        <div>
          <h2 className="text-lg font-semibold text-white">Bill Flow</h2>
          <p className="mt-2 text-sm leading-relaxed">
            A full-featured, SaaS-based invoicing platform to create, manage,
            and track invoices in real-time. Empowering businesses with
            automation, insights, and seamless payments.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
            Quick Links
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href="/features" className="hover:underline">
                Features
              </a>
            </li>
            <li>
              <a href="/pricing" className="hover:underline">
                Pricing
              </a>
            </li>
            <li>
              <a href="/about" className="hover:underline">
                About Us
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Social + Copyright */}
        <div className="flex flex-col items-start md:items-end justify-between">
          <div className="flex space-x-4 mb-4">
            <a
              href="https://github.com"
              aria-label="GitHub"
              className="hover:text-white"
            >
              <FaGithub size={20} />
            </a>
            <a
              href="https://twitter.com"
              aria-label="Twitter"
              className="hover:text-white"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="https://linkedin.com"
              aria-label="LinkedIn"
              className="hover:text-white"
            >
              <FaLinkedin size={20} />
            </a>
          </div>
          <p className="text-xs text-gray-400 text-right">
            &copy; {new Date().getFullYear()} Bill Flow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
