import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useInView } from "react-intersection-observer";

// Optimized imports (tree-shakeable)
import {
  FiArrowUp,
  FiPlay,
  FiClock,
  FiZap,
  FiShield,
  FiTrendingUp,
  FiCheck,
  FiChevronDown,
  FiMessageSquare,
  FiMail,
  FiCalendar,
  FiHelpCircle,
  FiArrowRight,
  FiStar,
} from "react-icons/fi";

// Contexts and data
import { useAuth } from "../contexts/AuthContext";
import { testimonialsData } from "../constants/testimonials";
import { faqData } from "../constants/faqs";
import { pricingPlansData } from "../constants/pricingPlans";
import { integrations } from "../constants/integrations";
import { features } from "../constants/features";

// Custom Components
const SectionTitle = ({ title, subtitle, icon }) => (
  <div className="text-center mb-16">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-600/10 mb-6"
    >
      <span className="text-2xl">{icon}</span>
    </motion.div>
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 mb-4"
    >
      {title}
    </motion.h2>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="text-xl text-gray-400 max-w-2xl mx-auto"
    >
      {subtitle}
    </motion.p>
  </div>
);
const VideoPlayer = React.memo(({ src, poster, className = "" }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error("Play failed", err);
        });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className={`relative group ${className}`}>
      <video
        ref={videoRef}
        poster={poster}
        className="w-full rounded-2xl transition-transform duration-500 group-hover:scale-105"
        onClick={togglePlay}
        loop
        muted
        playsInline
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center w-full h-full"
          aria-label="Play video"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300">
            <FiPlay className="w-8 h-8 text-white ml-1" />
          </div>
        </button>
      )}
    </div>
  );
});

const TestimonialCard = React.memo(({ name, role, content, rating }) => (
  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl h-full flex flex-col">
    <div className="flex items-center mb-6">
      {[...Array(5)].map((_, i) => (
        <FiStar
          key={i}
          className={`w-5 h-5 ${
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
          }`}
        />
      ))}
    </div>
    <p className="text-gray-300 mb-8 flex-grow">{content}</p>
    <div>
      <h4 className="font-bold text-xl text-white">{name}</h4>
      <p className="text-indigo-400">{role}</p>
    </div>
  </div>
));

const FeatureCard = React.memo(({ icon, title, description, items }) => {
  const IconComponent = icon;
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700/50 h-full"
    >
      <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
        <IconComponent className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <p className="text-gray-400 mb-6">{description}</p>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start">
            <FiCheck className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
            <span className="text-gray-300">{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
});

const PriceCard = React.memo(({ plan, isYearly }) => (
  <motion.div
    whileHover={{ y: -10 }}
    className={`relative rounded-2xl overflow-hidden border-2 ${
      plan.featured
        ? "border-indigo-500 shadow-xl shadow-indigo-500/10"
        : "border-gray-700"
    }`}
  >
    {plan.featured && (
      <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
        POPULAR
      </div>
    )}
    <div className="p-8 bg-gray-800">
      <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
      <p className="text-gray-400 mb-6">{plan.description}</p>
      <div className="mb-8">
        <div className="text-4xl font-bold text-white mb-1">
          {isYearly ? plan.annualPrice : plan.monthlyPrice}
          <span className="text-lg font-normal text-gray-400">
            {isYearly ? "/year" : "/month"}
          </span>
        </div>
        {isYearly && plan.annualPrice !== plan.monthlyPrice * 12 && (
          <div className="text-sm text-gray-400">
            Save{" "}
            {100 -
              Math.round((plan.annualPrice / (plan.monthlyPrice * 12)) * 100)}
            %
          </div>
        )}
      </div>
      <Link
        to="/register"
        className={`block w-full text-center py-3 px-6 rounded-lg font-bold transition-all ${
          plan.featured
            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
            : "bg-gray-700 text-white hover:bg-gray-600"
        }`}
      >
        Get Started
      </Link>
    </div>
    <div className="border-t border-gray-700 bg-gray-800/50 p-8">
      <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
        INCLUDED FEATURES
      </h4>
      <ul className="space-y-3">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start">
            <FiCheck className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  </motion.div>
));

const FAQItem = React.memo(({ question, answer, isActive, onClick }) => (
  <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
    <button
      onClick={onClick}
      className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
    >
      <h3 className="text-lg font-semibold text-white">{question}</h3>
      <motion.div
        animate={{ rotate: isActive ? 180 : 0 }}
        className="ml-4 flex-shrink-0"
      >
        <FiChevronDown className="w-6 h-6 text-indigo-500" />
      </motion.div>
    </button>
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="px-6 pb-6 pt-0 text-gray-400">{answer}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
));

// const ScrollToTop = () => {
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       setVisible(window.scrollY > 300);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const scrollToTop = () => {
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   return (
//     <AnimatePresence>
//       {visible && (
//         <motion.button
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           exit={{ opacity: 0, scale: 0.8 }}
//           onClick={scrollToTop}
//           className="fixed bottom-8 right-8 bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-2xl z-50 flex items-center justify-center"
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           aria-label="Scroll to top"
//         >
//           <FiArrowUp className="w-6 h-6" />
//         </motion.button>
//       )}
//     </AnimatePresence>
//   );
// };

const Home = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // State
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeFaqs, setActiveFaqs] = useState([]);
  const [isYearlyBilling, setIsYearlyBilling] = useState(false);

  // Refs
  const featuresRef = useRef(null);

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isLoggedIn) {
      const interval = setInterval(() => {
        setActiveTestimonial((prev) => (prev + 1) % testimonialsData.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  // Handlers
  const toggleFaq = useCallback((index) => {
    setActiveFaqs((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  }, []);

  const scrollToFeatures = useCallback(() => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Animation hooks
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const [heroRef, heroInView] = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  return (
    <div className="bg-gray-950 text-gray-100 min-h-screen">
      {/* Hero Section */}
      {!isLoggedIn ? (
        <section className="relative min-h-screen overflow-hidden flex items-center justify-center">
          {/* Animated background */}
          <motion.div
            animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 bg-[length:200%_200%]"
          />

          {/* Floating particles */}
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

          {/* Parallax video */}
          <motion.div
            style={{ y: y1 }}
            className="absolute inset-0 overflow-hidden"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-20"
              poster="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
            >
              <source
                src="https://assets.mixkit.co/videos/preview/mixkit-man-holding-a-credit-card-and-paying-with-it-43703-large.mp4"
                type="video/mp4"
              />
            </video>
          </motion.div>

          {/* Hero content */}
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              ref={heroRef}
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
                <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 inline-flex items-center text-indigo-300 text-sm font-medium">
                  <span className="relative flex h-3 w-3 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                  </span>
                  NEXT-GEN BILLING TECHNOLOGY
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400">
                  Quantum-Powered
                </span>{" "}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-400">
                  Financial Automation
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-xl opacity-90 mb-10 text-gray-300 max-w-3xl mx-auto"
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
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full font-bold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center"
                >
                  Start Free Trial
                </Link>
                <button
                  onClick={scrollToFeatures}
                  className="px-8 py-4 bg-transparent hover:bg-white/10 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white/30 backdrop-blur-sm flex items-center"
                >
                  Explore Features
                </button>
              </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={heroInView ? { opacity: 1 } : {}}
              transition={{ delay: 1.5 }}
              className="absolute bottom-10 left-0 right-0 flex justify-center"
            >
              <motion.button
                onClick={scrollToFeatures}
                animate={{ y: [0, 10, 0] }}
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
      ) : (
        <section className="relative min-h-[50vh] flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600">
          <div className="container mx-auto px-6 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Welcome Back!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-indigo-100 max-w-2xl mx-auto mb-8"
            >
              Ready to manage your invoices and billing with our AI-powered
              tools?
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link
                to="/admin"
                className="px-8 py-4 bg-white text-indigo-600 rounded-full font-bold shadow-xl hover:shadow-2xl hover:bg-gray-100 transition-all"
              >
                Go to Dashboard
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section ref={featuresRef} className="py-28 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle
            title={
              isLoggedIn
                ? "Your AI Billing Tools"
                : "Next-Gen Billing Intelligence"
            }
            subtitle={
              isLoggedIn
                ? "Powerful features at your fingertips"
                : "Powered by our proprietary QuantumAI engine"
            }
            icon="⚡"
          />

          <div className="grid lg:grid-cols-3 gap-8 mt-16">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                items={feature.items}
              />
            ))}
          </div>
        </div>

        {/* Floating gradients */}
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
          className="absolute -left-20 -top-20 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl -z-10"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 3,
          }}
          className="absolute -right-20 bottom-0 w-72 h-72 rounded-full bg-purple-500/10 blur-3xl -z-10"
        />
      </section>

      {/* Workflow Section (non-logged in only) */}
      {!isLoggedIn && (
        <section className="py-28 bg-gradient-to-b from-gray-900 to-gray-950 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <SectionTitle
              title="Hyper-Efficient Workflow"
              subtitle="From invoice to payment in record time"
              icon="⏱️"
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
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100/10 text-indigo-300 text-sm font-bold mb-6">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse"></span>
                    STEP 1
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-6">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                      Neural Network-Assisted
                    </span>{" "}
                    Invoice Creation
                  </h3>
                  <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                    Our quantum-enhanced AI learns from your past invoices to
                    suggest optimal layouts, payment terms, and even predict
                    which clients might pay late. Just review and send.
                  </p>
                  <div className="grid gap-4">
                    {[
                      "Auto-populate client details from your CRM",
                      "Smart suggestions for descriptions and pricing",
                      "Automated tax calculations based on location",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500/10 text-indigo-400">
                            <FiCheck className="w-5 h-5" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-gray-300 font-medium">{item}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="order-2 lg:order-1">
                  <VideoPlayer
                    src="https://assets.mixkit.co/videos/preview/mixkit-fingers-typing-on-a-laptop-keyboard-4392-large.mp4"
                    poster="https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=735&q=80"
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
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100/10 text-purple-300 text-sm font-bold mb-6">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></span>
                    STEP 2
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-6">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                      Omnichannel
                    </span>{" "}
                    Distribution
                  </h3>
                  <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                    Send invoices via email, text, WhatsApp, or even social
                    media. Our platform tracks opens, views, and engagement in
                    real-time with advanced analytics.
                  </p>
                  <div className="grid gap-4">
                    {[
                      "Customizable email templates with your branding",
                      "Read receipts and engagement tracking",
                      "Scheduled sending for optimal delivery times",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-500/10 text-purple-400">
                            <FiCheck className="w-5 h-5" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-gray-300 font-medium">{item}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <VideoPlayer
                    src="https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-woman-paying-with-a-credit-card-43805-large.mp4"
                    poster="https://images.unsplash.com/photo-1604591251651-2da19891a9b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80"
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
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-pink-100/10 text-pink-300 text-sm font-bold mb-6">
                    <span className="w-2 h-2 bg-pink-500 rounded-full mr-2 animate-pulse"></span>
                    STEP 3
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-6">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-400">
                      Autonomous
                    </span>{" "}
                    Follow-ups & Reconciliation
                  </h3>
                  <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                    Our system automatically follows up on late payments with
                    personalized sequences and matches incoming payments to
                    correct invoices using machine learning.
                  </p>
                  <div className="grid gap-4">
                    {[
                      "Customizable reminder sequences",
                      "Automatic bank reconciliation",
                      "Payment matching with machine learning",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-pink-500/10 text-pink-400">
                            <FiCheck className="w-5 h-5" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-gray-300 font-medium">{item}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="order-2 lg:order-1">
                  <VideoPlayer
                    src="https://assets.mixkit.co/videos/preview/mixkit-woman-checking-her-bank-statement-online-43705-large.mp4"
                    poster="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Integration Showcase */}
      <section className="py-28 bg-gradient-to-b from-gray-950 to-gray-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle
            title="Universal Connectivity"
            subtitle="Seamless integration with your existing stack"
            icon="🔌"
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
                className="bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-700 flex items-center justify-center h-32"
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
        </div>

        {/* Background grid */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute inset-0 bg-grid-gray-800/5 [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]"></div>
        </div>
      </section>

      {/* Testimonials Section (non-logged in only) */}
      {!isLoggedIn && (
        <section className="py-28 bg-gradient-to-b from-gray-900 to-gray-950 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <SectionTitle
              title="Trusted by Innovators"
              subtitle="Join thousands of businesses transforming their billing"
              icon="✨"
            />

            <div className="mt-16 grid lg:grid-cols-2 gap-10">
              {/* Video testimonials */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700 shadow-xl"
              >
                <h3 className="text-2xl font-bold text-white mb-8">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                    Video
                  </span>{" "}
                  Testimonials
                </h3>

                <div className="space-y-8">
                  <div className="group">
                    <VideoPlayer
                      src="https://assets.mixkit.co/videos/preview/mixkit-businessman-holding-a-credit-card-at-an-office-43706-large.mp4"
                      poster="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1511&q=80"
                    />
                    <div className="p-6 bg-gray-800 rounded-b-xl">
                      <h4 className="font-bold text-xl text-white">
                        Mark Johnson, CFO at TechCorp
                      </h4>
                      <p className="text-gray-400 mt-2">
                        "Reduced our billing cycle from 45 to 14 days while
                        eliminating 98% of errors."
                      </p>
                      <div className="mt-4 flex items-center">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className="w-5 h-5 text-yellow-400 fill-yellow-400"
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-400">
                          5.0 Rating
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <VideoPlayer
                      src="https://assets.mixkit.co/videos/preview/mixkit-woman-checking-her-bank-statement-online-43705-large.mp4"
                      poster="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                    />
                    <div className="p-6 bg-gray-800 rounded-b-xl">
                      <h4 className="font-bold text-xl text-white">
                        Sarah Williams, Freelance Designer
                      </h4>
                      <p className="text-gray-400 mt-2">
                        "Automated my entire billing process, saving me 15 hours
                        a month on admin work."
                      </p>
                      <div className="mt-4 flex items-center">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className="w-5 h-5 text-yellow-400 fill-yellow-400"
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-400">
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
                className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700 shadow-xl"
              >
                <h3 className="text-2xl font-bold text-white mb-8">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
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
                      className="h-full"
                    >
                      <TestimonialCard
                        {...testimonialsData[activeTestimonial]}
                      />
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
                            : "bg-gray-600 hover:bg-gray-500"
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
      )}

      {/* Pricing Section (non-logged in only) */}
      {!isLoggedIn && (
        <section className="py-28 bg-gradient-to-b from-gray-900 to-gray-950 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <SectionTitle
              title="Simple, Transparent Pricing"
              subtitle="Pay only for what you need"
              icon="💎"
            />

            {/* Toggle */}
            <div className="flex items-center justify-center mb-12">
              <span
                className={`mr-4 font-medium ${
                  !isYearlyBilling ? "text-indigo-400" : "text-gray-500"
                }`}
              >
                Monthly
              </span>
              <button
                onClick={() => setIsYearlyBilling(!isYearlyBilling)}
                className="relative w-16 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md focus:outline-none"
              >
                <motion.div
                  animate={{
                    x: isYearlyBilling ? "100%" : "0%",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md"
                  style={{ x: isYearlyBilling ? "calc(100% - 28px)" : "2px" }}
                />
              </button>
              <span
                className={`ml-4 font-medium ${
                  isYearlyBilling ? "text-indigo-400" : "text-gray-500"
                }`}
              >
                Yearly (2 months free)
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-8">
              {pricingPlansData.map((plan, index) => (
                <PriceCard key={index} plan={plan} isYearly={isYearlyBilling} />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-16 text-center"
            >
              <p className="text-gray-500 mb-6">
                Need something custom? We offer enterprise solutions.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 border border-gray-600 rounded-full font-medium text-gray-300 hover:bg-gray-800 transition-colors"
              >
                Contact Sales
                <FiArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* FAQ Section (non-logged in only) */}
      {!isLoggedIn && (
        <section className="py-28 bg-gradient-to-b from-gray-900 to-gray-950 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-6">
            <SectionTitle
              title="Frequently Asked Questions"
              subtitle="Everything you need to know"
              icon="❓"
            />

            <div className="mt-12 space-y-4">
              {faqData.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isActive={activeFaqs.includes(index)}
                  onClick={() => toggleFaq(index)}
                />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-16 text-center"
            >
              <p className="text-gray-500 mb-6">
                Still have questions? We're here to help.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-bold shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
              >
                Contact Support
                <FiHelpCircle className="h-5 w-5 ml-2" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section */}
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
              {isLoggedIn
                ? "Need Help With Anything?"
                : "Ready to Transform Your Billing?"}
            </h2>
            <p className="text-xl text-indigo-200 mb-10 max-w-3xl mx-auto">
              {isLoggedIn
                ? "Our support team is here to help you get the most out of our platform."
                : "Join thousands of businesses automating their invoicing with our AI-powered platform."}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/contact"
                    className="px-8 py-4 bg-white text-indigo-600 rounded-full font-bold shadow-xl hover:shadow-2xl hover:bg-gray-100 transition-all"
                  >
                    Contact Support
                  </Link>
                  <Link
                    to="/admin"
                    className="px-8 py-4 bg-transparent text-white rounded-full font-bold shadow-xl hover:shadow-2xl hover:bg-white/10 transition-all border-2 border-white/30"
                  >
                    Go to Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="px-8 py-4 bg-white text-indigo-600 rounded-full font-bold shadow-xl hover:shadow-2xl hover:bg-gray-100 transition-all"
                  >
                    Start Free Trial
                  </Link>
                  <Link
                    to="/demo"
                    className="px-8 py-4 bg-transparent text-white rounded-full font-bold shadow-xl hover:shadow-2xl hover:bg-white/10 transition-all border-2 border-white/30"
                  >
                    Schedule Demo
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Floating particles */}
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
    </div>
  );
};

export default Home;
