import React, { useState, useEffect } from "react";
import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaYoutube,
  FaInstagram,
  FaRegEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Update year in case component stays mounted across year change
    const interval = setInterval(() => {
      setYear(new Date().getFullYear());
    }, 1000 * 60 * 60); // Check every hour

    // Animation trigger
    const handleScroll = () => {
      if (
        window.scrollY >
        document.body.scrollHeight - window.innerHeight - 300
      ) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail("");
      // Reset after 5 seconds
      setTimeout(() => setIsSubscribed(false), 5000);
    }, 1500);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.footer
      className="bg-gray-900 text-gray-300 py-12 px-4 md:px-12 mt-16"
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <span className="bg-indigo-600 text-white p-2 rounded-lg mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </span>
              InvoicePro
            </h2>
            <p className="text-sm leading-relaxed">
              A full-featured, SaaS-based invoicing platform to create, manage,
              and track invoices in real-time. Empowering businesses with
              automation, insights, and seamless payments.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 mt-4">
              <div className="flex items-start">
                <FaRegEnvelope className="mt-1 mr-2 text-indigo-400" />
                <a
                  href="mailto:support@invoicepro.com"
                  className="hover:text-indigo-400 transition-colors duration-200"
                >
                  support@invoicepro.com
                </a>
              </div>
              <div className="flex items-start">
                <FaPhoneAlt className="mt-1 mr-2 text-indigo-400" />
                <a
                  href="tel:+11234567890"
                  className="hover:text-indigo-400 transition-colors duration-200"
                >
                  +1 (123) 456-7890
                </a>
              </div>
              <div className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-2 text-indigo-400" />
                <span>
                  123 Business Ave, Suite 500, San Francisco, CA 94107
                </span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/features"
                  className="hover:text-indigo-400 transition-colors duration-200 hover:underline flex items-center"
                >
                  <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="hover:text-indigo-400 transition-colors duration-200 hover:underline flex items-center"
                >
                  <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/testimonials"
                  className="hover:text-indigo-400 transition-colors duration-200 hover:underline flex items-center"
                >
                  <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                  Testimonials
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="hover:text-indigo-400 transition-colors duration-200 hover:underline flex items-center"
                >
                  <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-indigo-400 transition-colors duration-200 hover:underline flex items-center"
                >
                  <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/demo"
                  className="hover:text-indigo-400 transition-colors duration-200 hover:underline flex items-center"
                >
                  <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                  Request Demo
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
              Resources
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/help-center"
                  className="hover:text-indigo-400 transition-colors duration-200 hover:underline flex items-center"
                >
                  <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/documentation"
                  className="hover:text-indigo-400 transition-colors duration-200 hover:underline flex items-center"
                >
                  <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  to="/api"
                  className="hover:text-indigo-400 transition-colors duration-200 hover:underline flex items-center"
                >
                  <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                  API Reference
                </Link>
              </li>
              <li>
                <Link
                  to="/community"
                  className="hover:text-indigo-400 transition-colors duration-200 hover:underline flex items-center"
                >
                  <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                  Community
                </Link>
              </li>
              <li>
                <Link
                  to="/status"
                  className="hover:text-indigo-400 transition-colors duration-200 hover:underline flex items-center"
                >
                  <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                  System Status
                </Link>
              </li>
              <li>
                <Link
                  to="/security"
                  className="hover:text-indigo-400 transition-colors duration-200 hover:underline flex items-center"
                >
                  <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                  Security
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
              Subscribe to our newsletter
            </h3>
            <p className="text-sm">
              Get the latest updates, news and product offers via email.
            </p>

            {isSubscribed ? (
              <div className="p-3 bg-green-100 text-green-800 rounded-md text-sm">
                Thank you for subscribing! You'll receive our next newsletter
                soon.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="flex-grow px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-r-md text-white ${
                      isLoading
                        ? "bg-indigo-400"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    } transition-colors duration-200`}
                  >
                    {isLoading ? (
                      <svg
                        className="animate-spin h-5 w-5 text-white mx-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      "Subscribe"
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-400">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </form>
            )}

            <div className="pt-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-2">
                Follow Us
              </h3>
              <div className="flex space-x-4">
                <a
                  href="https://facebook.com"
                  aria-label="Facebook"
                  className="hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <FaFacebook size={20} />
                </a>
                <a
                  href="https://twitter.com"
                  aria-label="Twitter"
                  className="hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <FaTwitter size={20} />
                </a>
                <a
                  href="https://linkedin.com"
                  aria-label="LinkedIn"
                  className="hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <FaLinkedin size={20} />
                </a>
                <a
                  href="https://github.com"
                  aria-label="GitHub"
                  className="hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <FaGithub size={20} />
                </a>
                <a
                  href="https://youtube.com"
                  aria-label="YouTube"
                  className="hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <FaYoutube size={20} />
                </a>
                <a
                  href="https://instagram.com"
                  aria-label="Instagram"
                  className="hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <FaInstagram size={20} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          className="border-t border-gray-700 pt-8"
          variants={itemVariants}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-gray-400 mb-4 md:mb-0">
              &copy; {year} InvoicePro. All rights reserved.
            </p>

            <div className="flex space-x-6">
              <Link
                to="/privacy"
                className="text-xs text-gray-400 hover:text-indigo-400 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-xs text-gray-400 hover:text-indigo-400 transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="text-xs text-gray-400 hover:text-indigo-400 transition-colors duration-200"
              >
                Cookie Policy
              </Link>
              <Link
                to="/gdpr"
                className="text-xs text-gray-400 hover:text-indigo-400 transition-colors duration-200"
              >
                GDPR Compliance
              </Link>
            </div>
          </div>

          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              Made with ❤️ by the InvoicePro team •
              <span className="inline-block mx-1">Version 2.1.0</span>
            </p>
            <p className="text-xs text-gray-600 mt-1">
              This product uses the Stripe API but is not endorsed or certified
              by Stripe.
            </p>
          </div>
        </motion.div>

        {/* Back to Top Button */}
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl focus:outline-none"
          variants={itemVariants}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Back to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </motion.button>
      </div>
    </motion.footer>
  );
};

export default Footer;
