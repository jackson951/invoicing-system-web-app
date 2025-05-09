import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { useInView } from "react-intersection-observer";

// Static imports for better performance
import SectionTitle from "../components/SectionTitle";
import TestimonialCard from "../components/TestimonialCard";
import { testimonialsData } from "../constants/testimonials";
import { faqData } from "../constants/faqs";
import { pricingPlansData } from "../constants/pricingPlans";

// Optimized VideoPlayer component with lazy loading
const VideoPlayer = React.memo(
  ({ src, poster, className = "", borderRadius = "xl" }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const togglePlay = () => {
      const video = videoRef.current;
      if (video.paused) {
        video
          .play()
          .then(() => setIsPlaying(true))
          .catch((e) => console.error("Video play failed:", e));
      } else {
        video.pause();
        setIsPlaying(false);
      }
    };

    return (
      <div
        className={`relative ${className} group`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          initial={{ opacity: 0.8 }}
          animate={{
            opacity: isHovered ? 1 : 0.8,
            scale: isHovered ? 1.02 : 1,
          }}
          transition={{ duration: 0.3 }}
          className={`relative overflow-hidden rounded-${borderRadius} bg-gradient-to-br from-indigo-500/10 to-purple-600/10 border border-white/10 backdrop-blur-sm`}
        >
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            className={`w-full rounded-${borderRadius} transition-all duration-500 ${
              isPlaying ? "scale-100" : "group-hover:scale-105"
            }`}
            onClick={togglePlay}
            loop
            muted
            playsInline
            preload="none"
            loading="lazy"
          />

          {!isPlaying && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center w-full h-full"
              aria-label="Play video"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-10 h-10 text-white"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </motion.button>
          )}

          <motion.div
            animate={{
              backgroundPosition: isHovered ? "100% 50%" : "0% 50%",
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 pointer-events-none bg-[length:200%_200%] bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-xl mix-blend-overlay"
          />
        </motion.div>
      </div>
    );
  }
);

// Optimized NewsletterSignup with memoization
const NewsletterSignup = React.memo(() => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail("");
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl p-8 shadow-2xl"
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
          className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 bg-[length:200%_200%] opacity-90"
        />

        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 5,
            }}
            className="absolute rounded-full bg-white/30"
            style={{
              width: `${5 + Math.random() * 10}px`,
              height: `${5 + Math.random() * 10}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <h3 className="text-3xl font-bold text-white mb-3">
          Join the <span className="text-indigo-200">Billing Revolution</span>
        </h3>
        <p className="text-indigo-100 mb-6 max-w-lg">
          Subscribe to our quantum-powered newsletter for exclusive insights,
          early feature access, and productivity hacks.
        </p>

        {isSubscribed ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/20 p-6 rounded-lg backdrop-blur-sm text-center"
          >
            <p className="text-white font-medium text-lg">
              🚀 Welcome to the future of invoicing! Check your email for
              confirmation.
            </p>
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3"
          >
            <motion.div
              whileFocus={{ scale: 1.02 }}
              className="flex-1 relative"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your quantum email"
                required
                className="w-full px-5 py-4 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              />
              <div className="absolute inset-0 rounded-lg pointer-events-none border border-white/20 mix-blend-overlay" />
            </motion.div>
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-lg hover:bg-gray-100 transition-all disabled:opacity-70 flex items-center justify-center min-w-[180px]"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-indigo-600"
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
                  Warping...
                </>
              ) : (
                "Beam Me Up"
              )}
            </motion.button>
          </form>
        )}
      </div>
    </motion.div>
  );
});

// Optimized PricingToggle with memoization
const PricingToggle = React.memo(({ isYearly, onToggle }) => {
  return (
    <div className="flex items-center justify-center mb-12">
      <span
        className={`mr-4 font-medium ${
          !isYearly ? "text-indigo-500" : "text-gray-400"
        }`}
      >
        Monthly
      </span>
      <button
        onClick={onToggle}
        className="relative w-16 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md focus:outline-none"
      >
        <motion.div
          animate={{
            x: isYearly ? "100%" : "0%",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md"
          style={{ x: isYearly ? "calc(100% - 28px)" : "2px" }}
        />
      </button>
      <span
        className={`ml-4 font-medium ${
          isYearly ? "text-indigo-500" : "text-gray-400"
        }`}
      >
        Yearly (2 months free)
      </span>
    </div>
  );
});

const Home = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeFaqs, setActiveFaqs] = useState([]);
  const [isYearlyBilling, setIsYearlyBilling] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Auto-slide testimonials with cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonialsData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to top button visibility with cleanup
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // FAQ Toggle logic
  const toggleFaq = (index) => {
    setActiveFaqs((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Pricing plan price selector
  const getPlanPrice = (plan) =>
    isYearlyBilling
      ? `$${plan.annualPrice} / year`
      : `$${plan.monthlyPrice} / month`;

  // Intersection observer for animations
  const [heroRef, heroInView] = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  // Parallax effects
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  // Optimized integrations data
  const integrations = [
    {
      name: "QuickBooks",
      logo: "https://logos-world.net/wp-content/uploads/2021/02/QuickBooks-Symbol.png",
    },
    {
      name: "Xero",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Xero_logo.svg/2560px-Xero_logo.svg.png",
    },
    {
      name: "Stripe",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png",
    },
    {
      name: "PayPal",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/2560px-PayPal.svg.png",
    },
    {
      name: "Shopify",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Shopify_logo_2018.svg/2560px-Shopify_logo_2018.svg.png",
    },
    {
      name: "HubSpot",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/HubSpot_Logo.svg/2560px-HubSpot_Logo.svg.png",
    },
    {
      name: "Zapier",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Zapier_logo.png/640px-Zapier_logo.png",
    },
    {
      name: "Slack",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/2048px-Slack_icon_2019.svg.png",
    },
  ];

  return (
    <div className="font-sans text-gray-800 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
      {/* Hero Section with Parallax Effect */}
      <section
        ref={heroRef}
        className="relative min-h-screen max-h-[1000px] overflow-hidden flex items-center justify-center"
      >
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
          className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 bg-[length:200%_200%]"
        />

        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, 100, 0],
              y: [0, 100, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 5,
            }}
            className="absolute rounded-full bg-white/10"
            style={{
              width: `${3 + Math.random() * 7}px`,
              height: `${3 + Math.random() * 7}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}

        <motion.div
          style={{ y: y1 }}
          className="absolute inset-0 overflow-hidden"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-30"
            poster="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
            preload="none"
          >
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-man-holding-a-credit-card-and-paying-with-it-43703-large.mp4"
              type="video/mp4"
            />
          </video>
        </motion.div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl text-center mx-auto"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={heroInView ? { scale: 1 } : {}}
              transition={{ duration: 1, delay: 0.5 }}
              className="inline-block mb-6"
            >
              <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 inline-flex items-center text-indigo-200 text-sm font-medium">
                <span className="relative flex h-3 w-3 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                </span>
                AI-POWERED BILLING 3.0
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight text-white"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400">
                Quantum
              </span>{" "}
              Invoicing <br />
              for the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-400">
                Digital Age
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl md:text-2xl opacity-90 mb-10 text-gray-300 max-w-3xl mx-auto"
            >
              Harness the power of artificial intelligence to automate your
              billing, eliminate errors, and get paid faster than ever before.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link
                to="/register"
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                Start Free Trial
              </Link>
              <button className="px-8 py-4 bg-transparent hover:bg-white/10 text-white rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-white/30 backdrop-blur-sm flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                </svg>
                Watch Demo
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10 left-0 right-0 flex justify-center"
          >
            <motion.button
              onClick={() => {
                const featuresSection = document.getElementById("features");
                featuresSection?.scrollIntoView({ behavior: "smooth" });
              }}
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 hover:border-white/40 transition-colors"
              aria-label="Scroll down"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* AI Features Section with Floating Cards */}
      <section id="features" className="py-28 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle
            title="Next-Gen Billing Intelligence"
            subtitle="Powered by our proprietary QuantumAI engine"
            icon="⚡"
            centered
          />

          <div className="grid lg:grid-cols-3 gap-8 mt-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 h-full border border-gray-100 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Predictive Invoice Generation
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Our AI learns your billing patterns to auto-generate invoices
                  with optimal layouts, payment terms, and even predict late
                  payments before they happen.
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Context-aware line item suggestions</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt=0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Smart tax calculation by jurisdiction</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt=0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Payment likelihood scoring</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity=50 transition duration-300"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 h-full border border-gray-100 dark:border-gray=700 shadow-xl hover:shadow-2xl transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Automated Error Defense
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Our neural networks scan each invoice in real-time to catch
                  mistakes in amounts, client details, or missing information
                  before they reach your clients.
                </p>
                <ul className="space-y=2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt=0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Anomaly detection for amounts</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt=0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Client data validation</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt=0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Required field verification</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl blur opacity=25 group-hover:opacity=50 transition duration-300"></div>
              <div className="relative bg-white dark:bg-gray=800 rounded-2xl p-8 h-full border border-gray=100 dark:border-gray=700 shadow-xl hover:shadow-2xl transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Cash Flow Forecasting
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Advanced algorithms analyze historical data, seasonal trends,
                  and client behaviors to predict your future cash flow with 95%
                  accuracy.
                </p>
                <ul className="space-y=2 text-gray=700 dark:text-gray=300">
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt=0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>30/60/90 day projections</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt=0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Client payment behavior analysis</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt=0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Seasonal trend detection</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute -left-20 -top-20 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl -z-10"
        />
        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 3,
          }}
          className="absolute -right-20 bottom-0 w-72 h-72 rounded-full bg-purple-500/10 blur-3xl -z-10"
        />
      </section>

      {/* Workflow Section with Animated Steps */}
      <section
        id="process"
        className="py-28 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle
            title="Hyper-Efficient Workflow"
            subtitle="From invoice to payment in record time"
            icon="⏱️"
            centered
          />

          <div className="mt-20 space-y-32">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="grid lg:grid-cols-2 gap-16 items-center"
            >
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 text-sm font-bold mb-6">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2 animate-pulse"></span>
                  STEP 1
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    Neural Network-Assisted
                  </span>{" "}
                  Invoice Creation
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  Our quantum-enhanced AI learns from your past invoices to
                  suggest optimal layouts, payment terms, and even predict which
                  clients might pay late. Just review and send.
                </p>
                <div className="grid gap-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-600">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-700 dark:text-gray-300 font-medium">
                        Auto-populate client details from your CRM
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt=1">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-600">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-700 dark:text-gray-300 font-medium">
                        Smart suggestions for descriptions and pricing
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt=1">
                      <div className="flex items-center justify-center h=8 w=8 rounded-full bg-indigo-100 text-indigo-600">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-700 dark:text-gray-300 font-medium">
                        Automated tax calculations based on location
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-2 lg:order-1">
                <VideoPlayer
                  src="https://assets.mixkit.co/videos/preview/mixkit-fingers-typing-on-a-laptop-keyboard-4392-large.mp4"
                  poster="https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80"
                  borderRadius="2xl"
                />
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="grid lg:grid-cols-2 gap-16 items-center"
            >
              <div>
                <div className="inline-flex items-center px-4 py=2 rounded-full bg-purple-100 text-purple-800 text-sm font-bold mb-6">
                  <span className="w-2 h=2 bg-purple-600 rounded-full mr-2 animate-pulse"></span>
                  STEP 2
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                    Omnichannel
                  </span>{" "}
                  Distribution
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  Send invoices via email, text, WhatsApp, or even social media.
                  Our platform tracks opens, views, and engagement in real-time
                  with advanced analytics.
                </p>
                <div className="grid gap-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt=1">
                      <div className="flex items-center justify-center h=8 w=8 rounded-full bg-purple-100 text-purple-600">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-700 dark:text-gray-300 font-medium">
                        Customizable email templates with your branding
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt=1">
                      <div className="flex items-center justify-center h=8 w=8 rounded-full bg-purple-100 text-purple-600">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-700 dark:text-gray-300 font-medium">
                        Read receipts and engagement tracking
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt=1">
                      <div className="flex items-center justify-center h=8 w=8 rounded-full bg-purple-100 text-purple-600">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-700 dark:text-gray-300 font-medium">
                        Scheduled sending for optimal delivery times
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <VideoPlayer
                  src="https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-woman-paying-with-a-credit-card-43805-large.mp4"
                  poster="https://images.unsplash.com/photo-1604591251651-2da19891a9b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                  borderRadius="2xl"
                />
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="grid lg:grid-cols-2 gap-16 items-center"
            >
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center px-4 py=2 rounded-full bg-pink-100 text-pink-800 text-sm font-bold mb-6">
                  <span className="w-2 h=2 bg-pink-600 rounded-full mr-2 animate-pulse"></span>
                  STEP 3
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-red-600">
                    Autonomous
                  </span>{" "}
                  Follow-ups & Reconciliation
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  Our system automatically follows up on late payments with
                  personalized sequences and matches incoming payments to
                  correct invoices using machine learning.
                </p>
                <div className="grid gap-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt=1">
                      <div className="flex items-center justify-center h=8 w=8 rounded-full bg-pink-100 text-pink-600">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-700 dark:text-gray-300 font-medium">
                        Customizable reminder sequences
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt=1">
                      <div className="flex items-center justify-center h=8 w=8 rounded-full bg-pink-100 text-pink-600">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-700 dark:text-gray-300 font-medium">
                        Automatic bank reconciliation
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt=1">
                      <div className="flex items-center justify-center h=8 w=8 rounded-full bg-pink-100 text-pink-600">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-700 dark:text-gray-300 font-medium">
                        Payment matching with machine learning
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-2 lg:order-1">
                <VideoPlayer
                  src="https://assets.mixkit.co/videos/preview/mixkit-woman-checking-her-bank-statement-online-43705-large.mp4"
                  poster="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                  borderRadius="2xl"
                />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 opacity-10 -ml=0.5 -z-10"></div>
      </section>

      {/* Integration Showcase with Floating Grid */}
      <section className="py-28 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle
            title="Universal Connectivity"
            subtitle="Seamless integration with your existing stack"
            icon="🔌"
            centered
          />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1 }}
            className="mt-16 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {integrations.map((integration, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 flex items-center justify-center h-32"
              >
                <motion.img
                  src={integration.logo}
                  alt={integration.name}
                  className="h-12 object-contain opacity-80 hover:opacity-100 transition-opacity"
                  whileHover={{ scale: 1.1 }}
                  loading="lazy"
                />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-20"
          >
            <NewsletterSignup />
          </motion.div>
        </div>

        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute inset-0 bg-grid-white/5 dark:bg-grid-gray-800/5 [mask-image:linear-gradient(to_bottom,transparent,white,transparent)] dark:[mask-image:linear-gradient(to_bottom,transparent,black,transparent)]"></div>
        </div>
      </section>

      {/* Testimonials Section with Video & Written */}
      <section
        id="testimonials"
        className="py-28 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle
            title="Trusted by Innovators"
            subtitle="Join thousands of businesses transforming their billing"
            icon="✨"
            centered
          />

          <div className="mt-16 grid lg:grid-cols-2 gap-10">
            {/* Video testimonials */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-white/50 to-white/80 dark:from-gray-800/50 dark:to-gray-800/80 backdrop-blur-sm rounded-3xl p-8 border border-white/30 dark:border-gray-700/50 shadow-xl"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  Video
                </span>{" "}
                Testimonials
              </h3>

              <div className="space-y-8">
                <div className="group">
                  <VideoPlayer
                    src="https://assets.mixkit.co/videos/preview/mixkit-businessman-holding-a-credit-card-at-an-office-43706-large.mp4"
                    poster="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1511&q=80"
                  />
                  <div className="p-6 bg-white dark:bg-gray-800 rounded-b-xl">
                    <h4 className="font-bold text-xl text-gray-900 dark:text-white">
                      Mark Johnson, CFO at TechCorp
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                      "Reduced our billing cycle from 45 to 14 days while
                      eliminating 98% of errors."
                    </p>
                    <div className="mt-4 flex items-center">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-5 h-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        5.0 Rating
                      </span>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <VideoPlayer
                    src="https://assets.mixkit.co/videos/preview/mixkit-woman-checking-her-bank-statement-online-43705-large.mp4"
                    poster="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                  />
                  <div className="p-6 bg-white dark:bg-gray-800 rounded-b-xl">
                    <h4 className="font-bold text-xl text-gray-900 dark:text-white">
                      Sarah Williams, Freelance Designer
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                      "Automated my entire billing process, saving me 15 hours a
                      month on admin work."
                    </p>
                    <div className="mt-4 flex items-center">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-5 h-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        5.0 Rating
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Written testimonials */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-white/50 to-white/80 dark:from-gray-800/50 dark:to-gray-800/80 backdrop-blur-sm rounded-3xl p-8 border border-white/30 dark:border-gray-700/50 shadow-xl"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  Written
                </span>{" "}
                Testimonials
              </h3>

              <div className="relative h-full min-h-[500px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTestimonial}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden h-full"
                  >
                    <TestimonialCard {...testimonialsData[activeTestimonial]} />
                  </motion.div>
                </AnimatePresence>

                {/* Dots Navigation */}
                <div className="flex justify-center mt-8 space-x-2">
                  {testimonialsData.map((_, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => setActiveTestimonial(idx)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        activeTestimonial === idx
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 w-6"
                          : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"
                      }`}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={`Go to testimonial ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section with Interactive Toggle */}
      <section
        id="pricing"
        className="py-28 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle
            title="Simple, Transparent Pricing"
            subtitle="Pay only for what you need"
            icon="💎"
            centered
          />

          <PricingToggle
            isYearly={isYearlyBilling}
            onToggle={() => setIsYearlyBilling(!isYearlyBilling)}
          />

          <div className="grid md:grid-cols-3 gap-8 mt-8">
            {pricingPlansData.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className={`relative rounded-2xl overflow-hidden border-2 ${
                  plan.featured
                    ? "border-indigo-500 shadow-xl shadow-indigo-500/10"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                {plan.featured && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    MOST POPULAR
                  </div>
                )}
                <div className="p-8 bg-white dark:bg-gray-800">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {plan.description}
                  </p>

                  <div className="mb-8">
                    <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                      {isYearlyBilling
                        ? `$${plan.annualPrice}`
                        : `$${plan.monthlyPrice}`}
                      <span className="text-lg font-normal text-gray-500 dark:text-gray-400">
                        {isYearlyBilling ? "/year" : "/month"}
                      </span>
                    </div>
                    {isYearlyBilling &&
                      plan.annualPrice !== plan.monthlyPrice * 12 && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Save{" "}
                          {100 -
                            Math.round(
                              (plan.annualPrice / (plan.monthlyPrice * 12)) *
                                100
                            )}
                          %
                        </div>
                      )}
                  </div>

                  <Link
                    to="/register"
                    className={`block w-full text-center py-3 px-6 rounded-lg font-bold transition-all ${
                      plan.featured
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    Get Started
                  </Link>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 p-8">
                  <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                    What's included
                  </h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <svg
                          className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16 text-center"
          >
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Need something custom? We offer enterprise solutions.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-full font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Contact Sales
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section with Animated Expand/Collapse */}
      <section className="py-28 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6">
          <SectionTitle
            title="Frequently Asked Questions"
            subtitle="Everything you need to know"
            icon="❓"
            centered
          />

          <div className="mt-12 space-y-4">
            {faqData.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 dark:border-gray-700"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{
                      rotate: activeFaqs.includes(index) ? 180 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="ml-4 flex-shrink-0"
                  >
                    <svg
                      className="w-6 h-6 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </motion.div>
                </button>
                <AnimatePresence>
                  {activeFaqs.includes(index) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-0 text-gray-600 dark:text-gray-300">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16 text-center"
          >
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Still have questions? We're here to help.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-bold shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              Contact Support
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </Link>
          </motion.div>
        </div>

        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute -right-20 bottom-0 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl -z-10"
        />
      </section>

      {/* CTA Section with Gradient Background */}
      <section className="py-28 bg-gradient-to-br from-indigo-900 to-purple-900 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Billing?
            </h2>
            <p className="text-xl text-indigo-200 mb-10 max-w-3xl mx-auto">
              Join thousands of businesses automating their invoicing with our
              AI-powered platform. Start your free 14-day trial today—no credit
              card required.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-4 bg-white text-indigo-600 rounded-full font-bold shadow-xl hover:shadow-2xl hover:bg-gray-100 transition-all flex items-center"
              >
                Start Free Trial
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
              </Link>
              <Link
                to="/demo"
                className="px-8 py-4 bg-transparent text-white rounded-full font-bold shadow-xl hover:shadow-2xl hover:bg-white/10 transition-all border-2 border-white/30 flex items-center"
              >
                Schedule Demo
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>

        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, 100, 0],
              y: [0, 100, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 5,
            }}
            className="absolute rounded-full bg-white/10"
            style={{
              width: `${3 + Math.random() * 7}px`,
              height: `${3 + Math.random() * 7}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </section>

      {/* Scroll to top button */}
      {/* <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl hover:from-indigo-700 hover:to-purple-700 transition-all z-50 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Scroll to top"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </motion.button>
        )}
      </AnimatePresence> */}
    </div>
  );
};

export default Home;
