import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiArrowUp,
  FiGithub,
  FiTwitter,
  FiLinkedin,
  FiYoutube,
  FiInstagram,
  FiFacebook,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const Footer = () => {
  const [year] = useState(new Date().getFullYear());
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeHover, setActiveHover] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > window.innerHeight / 2);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 5000);
    }, 1500);
  };

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const socialLinks = [
    {
      icon: <FiGithub />,
      label: "GitHub",
      url: "https://github.com/jackson951",
    },
    { icon: <FiTwitter />, label: "Twitter", url: "https://twitter.com" },
    {
      icon: <FiLinkedin />,
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/jackson-khuto-625360267/",
    },
    { icon: <FiYoutube />, label: "YouTube", url: "https://youtube.com" },
    { icon: <FiInstagram />, label: "Instagram", url: "https://instagram.com" },
    { icon: <FiFacebook />, label: "Facebook", url: "https://facebook.com" },
  ];

  const quickLinks = [
    { name: "Features", path: "/features" },
    { name: "Pricing", path: "/pricing" },
    { name: "Testimonials", path: "/testimonials" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
    { name: "Request Demo", path: "/demo" },
  ];

  const resources = [
    { name: "Help Center", path: "/help-center" },
    { name: "Documentation", path: "/documentation" },
    { name: "API Reference", path: "/api" },
    { name: "Community", path: "/community" },
    { name: "System Status", path: "/status" },
    { name: "Security", path: "/security" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Cookie Policy", path: "/cookies" },
    { name: "GDPR Compliance", path: "/gdpr" },
  ];

  return (
    <motion.footer
      className="bg-gray-900 text-gray-400 pt-12 pb-8 px-4 sm:px-6 lg:px-8 border-t border-gray-800"
      initial="hidden"
      animate="visible"
      variants={container}
    >
      <div className="max-w-7xl mx-auto">
        {/* Grid Layout - Responsive columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand Column */}
          <motion.div variants={item} className="space-y-4">
            <Link to="/" className="flex items-center group">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
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
              </div>
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                QuantumInvoicer
              </span>
            </Link>

            <p className="text-sm text-gray-400">
              AI-powered billing automation for modern businesses.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 pt-2">
              <div className="flex items-start">
                <FiMail className="mt-1 mr-3 text-indigo-400 flex-shrink-0" />
                <a
                  href="mailto:support@quantuminvoicer.com"
                  className="text-sm hover:text-indigo-300 transition-colors"
                >
                  support@quantuminvoicer.com
                </a>
              </div>
              <div className="flex items-start">
                <FiPhone className="mt-1 mr-3 text-indigo-400 flex-shrink-0" />
                <a
                  href="tel:+27661802747"
                  className="text-sm hover:text-indigo-300 transition-colors"
                >
                  +27 66 180 2747
                </a>
              </div>
              <div className="flex items-start">
                <FiMapPin className="mt-1 mr-3 text-indigo-400 flex-shrink-0" />
                <span className="text-sm">
                  Kempton Park, Gauteng, South Africa
                </span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={item} className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-300">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <motion.li
                  key={link.path}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  <Link
                    to={link.path}
                    className="flex items-center text-sm hover:text-indigo-300 transition-colors group"
                    onMouseEnter={() => setActiveHover(link.path)}
                    onMouseLeave={() => setActiveHover(null)}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-3 transition-all ${
                        activeHover === link.path
                          ? "bg-indigo-500 scale-150"
                          : "bg-gray-600"
                      }`}
                    ></span>
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div variants={item} className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-300">
              Resources
            </h3>
            <ul className="space-y-2">
              {resources.map((link) => (
                <motion.li
                  key={link.path}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  <Link
                    to={link.path}
                    className="flex items-center text-sm hover:text-indigo-300 transition-colors group"
                    onMouseEnter={() => setActiveHover(link.path)}
                    onMouseLeave={() => setActiveHover(null)}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-3 transition-all ${
                        activeHover === link.path
                          ? "bg-indigo-500 scale-150"
                          : "bg-gray-600"
                      }`}
                    ></span>
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter & Social */}
          <motion.div variants={item} className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-300">
              Stay Updated
            </h3>
            <p className="text-sm text-gray-400">
              Subscribe for product updates and insights.
            </p>

            <AnimatePresence mode="wait">
              {isSubscribed ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-green-900/20 border border-green-800/50 text-green-400 p-3 rounded text-xs"
                >
                  Thanks for subscribing!
                </motion.div>
              ) : (
                <motion.form
                  onSubmit={handleSubscribe}
                  initial={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <div className="flex">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email"
                      className="flex-grow px-3 py-2 rounded-l bg-gray-800 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-300 placeholder-gray-500 text-sm"
                      required
                    />
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={!isLoading ? { scale: 1.05 } : {}}
                      whileTap={!isLoading ? { scale: 0.95 } : {}}
                      className={`px-3 py-2 rounded-r text-white text-sm ${
                        isLoading
                          ? "bg-indigo-700 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      } transition-all flex items-center justify-center min-w-[100px]`}
                    >
                      {isLoading ? (
                        <svg
                          className="animate-spin h-4 w-4 text-white"
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
                    </motion.button>
                  </div>
                  <p className="text-xs text-gray-500">
                    We respect your privacy.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Social Links */}
            <div className="pt-2">
              <h4 className="text-xs font-semibold text-gray-300 mb-2">
                Connect With Us
              </h4>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.url}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="h-8 w-8 rounded bg-gray-800 hover:bg-gray-700 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div variants={item} className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500">
              &copy; {year} QuantumInvoicer. All rights reserved.
            </p>

            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
              {legalLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-xs text-gray-500 hover:text-indigo-300 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="text-center mt-4">
            <p className="text-xs text-gray-600">
              Made with <span className="text-red-400">❤️</span> by Quantum Team
            </p>
          </div>
        </motion.div>
      </div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full shadow-md z-50 focus:outline-none"
            aria-label="Back to top"
          >
            <FiArrowUp className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.footer>
  );
};

export default Footer;
