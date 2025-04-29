import React from "react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 px-4 md:px-12 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Company Info */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Invoice Pro</h2>
          <p className="text-sm leading-relaxed">
            A full-featured, SaaS-based invoicing platform to create, manage,
            and track invoices in real-time. Empowering businesses with
            automation, insights, and seamless payments.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="/#features"
                className="hover:text-indigo-400 transition-colors duration-200 hover:underline"
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="/#pricing"
                className="hover:text-indigo-400 transition-colors duration-200 hover:underline"
              >
                Pricing
              </a>
            </li>
            <li>
              <a
                href="/#testimonials"
                className="hover:text-indigo-400 transition-colors duration-200 hover:underline"
              >
                Testimonials
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="hover:text-indigo-400 transition-colors duration-200 hover:underline"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Social + Copyright */}
        <div className="flex flex-col items-start md:items-end justify-between">
          <div className="flex space-x-6 mb-4">
            <a
              href="https://github.com"
              aria-label="GitHub"
              className="hover:text-white transition-all duration-300"
            >
              <FaGithub size={20} />
            </a>
            <a
              href="https://twitter.com"
              aria-label="Twitter"
              className="hover:text-white transition-all duration-300"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="https://linkedin.com"
              aria-label="LinkedIn"
              className="hover:text-white transition-all duration-300"
            >
              <FaLinkedin size={20} />
            </a>
          </div>
          <p className="text-xs text-gray-400 mt-4 md:mt-0 text-right">
            &copy; {new Date().getFullYear()} InvoicePro. All rights reserved.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center">
        <p className="text-sm text-gray-500">
          Powered by InvoicePro • Designed with love ❤️
        </p>
      </div>
    </footer>
  );
};

export default Footer;
