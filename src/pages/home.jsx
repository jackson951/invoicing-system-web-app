import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// Components
import SectionTitle from "../components/SectionTitle";
import TestimonialCard from "../components/TestimonialCard";
import Feature from "../components/Feature";
import ProcessStep from "../components/ProcessStep";
import UseCase from "../components/UseCase";
import FaqItem from "../components/FaqItem";

// Constants
import { testimonialsData } from "../constants/testimonials";
import { faqData } from "../constants/faqs";
import { pricingPlansData } from "../constants/pricingPlans";

// Inline VideoPlayer component since it wasn't provided
const VideoPlayer = ({ src, poster, className = "" }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full rounded-xl shadow-xl"
        onClick={togglePlay}
      />
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center w-full h-full"
          aria-label="Play video"
        >
          <div className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8 text-indigo-600"
            >
              <path
                fillRule="evenodd"
                d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </button>
      )}
    </div>
  );
};

// Inline NewsletterSignup component
const NewsletterSignup = () => {
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
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 shadow-xl">
      <h3 className="text-2xl font-bold text-white mb-3">
        Stay Updated with Our Latest Features
      </h3>
      <p className="text-indigo-100 mb-6">
        Join our newsletter to get tips, updates, and exclusive offers.
      </p>

      {isSubscribed ? (
        <div className="bg-white bg-opacity-20 p-4 rounded-lg text-center">
          <p className="text-white font-medium">🎉 Thanks for subscribing!</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-70"
          >
            {isLoading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      )}
    </div>
  );
};

const Home = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeFaqs, setActiveFaqs] = useState([]);
  const [isYearlyBilling, setIsYearlyBilling] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Auto-slide testimonials every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonialsData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // FAQ Toggle logic
  const toggleFaq = (index) => {
    setActiveFaqs((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Pricing plan price selector
  const getPlanPrice = (plan) =>
    isYearlyBilling
      ? `$${plan.annualPrice} / year`
      : `$${plan.monthlyPrice} / month`;

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="font-sans text-gray-800 bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section with Video Background */}
      <section className="relative h-screen max-h-[800px] overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-0"></div>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          poster="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-man-holding-a-credit-card-and-paying-with-it-43703-large.mp4"
            type="video/mp4"
          />
        </video>

        <div className="container mx-auto px-6 h-full flex items-center relative z-10">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              The Future of <span className="text-indigo-300">Invoicing</span>{" "}
              is Here
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8">
              AI-powered tools to automate your billing, reduce errors, and get
              paid faster.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Start Free Trial
              </Link>
              <button className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-white/20 backdrop-blur-sm">
                Watch Demo
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-0 right-0 flex justify-center z-10">
          <button
            onClick={() => {
              const featuresSection = document.getElementById("features");
              featuresSection.scrollIntoView({ behavior: "smooth" });
            }}
            className="animate-bounce w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
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
          </button>
        </div>
      </section>

      {/* AI Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <SectionTitle
            title="AI-Powered Features"
            subtitle="Leverage cutting-edge technology to streamline your billing"
            icon="🤖"
          />

          <div className="grid md:grid-cols-2 gap-12 mt-16">
            <div className="space-y-10">
              <Feature
                icon="🧠"
                title="Smart Invoice Generation"
                description="Our AI analyzes your past invoices to suggest optimal layouts, payment terms, and even predict late payments."
              />
              <Feature
                icon="🔍"
                title="Automated Error Detection"
                description="AI scans each invoice before sending to catch mistakes in amounts, client details, or missing information."
              />
              <Feature
                icon="📈"
                title="Cash Flow Forecasting"
                description="Predict future revenue based on historical data, seasonal trends, and client payment behaviors."
              />
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-xl overflow-hidden">
              <VideoPlayer
                src="https://assets.mixkit.co/videos/preview/mixkit-woman-checking-her-bank-statement-online-43705-large.mp4"
                poster="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1511&q=80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Advanced How It Works with Videos */}
      <section id="process" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <SectionTitle
            title="Advanced Workflows"
            subtitle="See how our platform transforms your billing process"
            icon="⚡"
          />

          <div className="mt-16 space-y-24">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <span className="inline-block bg-indigo-100 text-indigo-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                  Step 1
                </span>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  AI-Assisted Invoice Creation
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Our system learns from your past invoices to suggest line
                  items, descriptions, and pricing automatically. Just review
                  and send.
                </p>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-0.5">✔</span>
                    <span>Auto-populate client details from your CRM</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-0.5">✔</span>
                    <span>Smart suggestions for descriptions and pricing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-0.5">✔</span>
                    <span>Automated tax calculations based on location</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-xl overflow-hidden shadow-xl">
                <VideoPlayer
                  src="https://assets.mixkit.co/videos/preview/mixkit-fingers-typing-on-a-laptop-keyboard-4392-large.mp4"
                  poster="https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10 items-center md:flex-row-reverse">
              <div className="md:order-1">
                <span className="inline-block bg-indigo-100 text-indigo-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                  Step 2
                </span>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Multi-Channel Distribution
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Send invoices via email, text, or even WhatsApp. Track opens
                  and views in real-time with our engagement analytics.
                </p>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-0.5">✔</span>
                    <span>Customizable email templates with your branding</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-0.5">✔</span>
                    <span>Read receipts and engagement tracking</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-0.5">✔</span>
                    <span>Scheduled sending for optimal delivery times</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-xl overflow-hidden shadow-xl md:order-0">
                <VideoPlayer
                  src="https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-woman-paying-with-a-credit-card-43805-large.mp4"
                  poster="https://images.unsplash.com/photo-1604591251651-2da19891a9b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <span className="inline-block bg-indigo-100 text-indigo-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                  Step 3
                </span>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Automated Follow-ups & Reconciliation
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Our system automatically follows up on late payments and
                  matches incoming payments to the correct invoices.
                </p>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-0.5">✔</span>
                    <span>Customizable reminder sequences</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-0.5">✔</span>
                    <span>Automatic bank reconciliation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-0.5">✔</span>
                    <span>Payment matching with machine learning</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-xl overflow-hidden shadow-xl">
                <VideoPlayer
                  src="https://assets.mixkit.co/videos/preview/mixkit-woman-checking-her-bank-statement-online-43705-large.mp4"
                  poster="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Showcase */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <SectionTitle
            title="Seamless Integrations"
            subtitle="Connect with the tools you already use"
            icon="🔌"
          />

          <div className="mt-12 grid md:grid-cols-4 gap-6">
            {[
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
            ].map((integration, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center justify-center"
              >
                <img
                  src={integration.logo}
                  alt={integration.name}
                  className="h-12 object-contain opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>

          <div className="mt-16">
            <NewsletterSignup />
          </div>
        </div>
      </section>

      {/* Advanced Testimonials with Video Testimonials */}
      <section id="testimonials" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <SectionTitle
            title="Customer Success Stories"
            subtitle="See how businesses transformed their billing"
            icon="🎥"
          />

          <div className="mt-16 grid md:grid-cols-2 gap-10">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Video Testimonials
              </h3>

              <div className="space-y-6">
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <VideoPlayer
                    src="https://assets.mixkit.co/videos/preview/mixkit-businessman-holding-a-credit-card-at-an-office-43706-large.mp4"
                    poster="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1511&q=80"
                  />
                  <div className="p-4 bg-white dark:bg-gray-700">
                    <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                      Mark Johnson, CFO at TechCorp
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                      "Reduced our billing cycle from 45 to 14 days"
                    </p>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden shadow-lg">
                  <VideoPlayer
                    src="https://assets.mixkit.co/videos/preview/mixkit-woman-checking-her-bank-statement-online-43705-large.mp4"
                    poster="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                  />
                  <div className="p-4 bg-white dark:bg-gray-700">
                    <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                      Sarah Williams, Freelance Designer
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                      "Saves me 10 hours a month on admin work"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Written Testimonials
              </h3>

              <div className="relative h-full">
                <div className="bg-white dark:bg-gray-700 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden transition-all duration-500 ease-in-out h-full">
                  <TestimonialCard {...testimonialsData[activeTestimonial]} />
                </div>

                {/* Dots Navigation */}
                <div className="flex justify-center mt-6 space-x-2">
                  {testimonialsData.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTestimonial(idx)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        activeTestimonial === idx
                          ? "bg-indigo-600 w-8"
                          : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"
                      }`}
                      aria-label={`Go to testimonial ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-indigo-600 text-white p-3 rounded-full shadow-xl hover:bg-indigo-700 transition-colors z-50"
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
        </button>
      )}
    </div>
  );
};

export default Home;
