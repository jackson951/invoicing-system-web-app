import React, { useState, useEffect } from "react";
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

const Home = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeFaqs, setActiveFaqs] = useState([]);
  const [isYearlyBilling, setIsYearlyBilling] = useState(false);

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

  // Pricing plan price selector
  const getPlanPrice = (plan) =>
    isYearlyBilling
      ? `$${plan.annualPrice} / year`
      : `$${plan.monthlyPrice} / month`;

  return (
    <div className="font-sans text-gray-800 bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-white to-transparent"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
            Simplify Invoicing & Billing
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-2xl mx-auto">
            Powerful tools for managing clients, automating payments, and
            growing your business.
          </p>
          <Link
            to="/register"
            className="px-8 py-3 bg-white text-indigo-700 rounded-full font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 inline-block"
          >
            Start Free Trial
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <SectionTitle
            title="Powerful Features"
            subtitle="Everything you need to streamline billing."
            icon="⚙️"
          />
          <div className="grid md:grid-cols-3 gap-10 mt-12">
            <Feature
              icon="🚀"
              title="Automated Invoices"
              description="Schedule and send invoices automatically with reminders and follow-ups."
            />
            <Feature
              icon="💳"
              title="Multiple Payment Options"
              description="Accept credit cards, PayPal, ACH, and more directly within your invoices."
            />
            <Feature
              icon="📊"
              title="Advanced Reporting"
              description="Track cash flow, revenue trends, and client payment behavior in real-time."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="process" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <SectionTitle
            title="How It Works"
            subtitle="Three simple steps to get started with our platform."
            icon="✅"
          />
          <div className="mt-16 space-y-16">
            <ProcessStep
              number={1}
              title="Sign Up & Configure"
              description="Create your account in minutes and customize branding, currencies, and templates."
              isLeft={true}
            />
            <ProcessStep
              number={2}
              title="Start Sending Invoices"
              description="Send professional invoices instantly or schedule recurring bills for clients."
              isLeft={false}
            />
            <ProcessStep
              number={3}
              title="Get Paid Faster"
              description="Clients receive clear payment instructions and can pay securely in seconds."
              isLeft={true}
            />
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <SectionTitle
            title="Who Uses Our Platform?"
            subtitle="From freelancers to enterprises, we support businesses of all sizes."
            icon="👥"
          />
          <div className="grid md:grid-cols-2 gap-10 mt-12">
            <UseCase
              icon="🧑‍💻"
              title="Freelancers & Consultants"
              description="Quickly invoice multiple clients and manage expenses — all in one place."
            />
            <UseCase
              icon="🏢"
              title="Small Businesses"
              description="Simplify accounting workflows and reduce manual data entry across teams."
            />
            <UseCase
              icon="🏦"
              title="Accounting Firms"
              description="Manage multiple clients' invoicing needs efficiently with multi-tenant support."
            />
            <UseCase
              icon="🌍"
              title="Enterprises"
              description="Scale globally with advanced automation, white-label options, and API integrations."
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <SectionTitle
            title="What Our Customers Say"
            subtitle="Real feedback from users who love our platform."
            icon="💬"
          />
          <div className="relative mt-12">
            <div className="bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden transition-all duration-500 ease-in-out">
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
      </section>

      {/* Pricing Plans */}
      <section id="pricing" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <SectionTitle
            title="Simple Pricing Plans"
            subtitle="Choose the plan that fits your business size and goals."
            icon="💰"
          />

          {/* Billing Toggle */}
          <div className="flex justify-center items-center my-6">
            <span className="mr-4 font-medium text-gray-700 dark:text-gray-300">
              Monthly
            </span>
            <label className="inline-flex relative items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isYearlyBilling}
                onChange={() => setIsYearlyBilling(!isYearlyBilling)}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
            <span className="ml-4 font-medium text-gray-700 dark:text-gray-300">
              Yearly
            </span>
          </div>

          {/* Plan Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-12 text-left">
            {pricingPlansData.map((plan, index) => (
              <div
                key={index}
                className={`bg-white dark:bg-gray-700 p-8 rounded-xl shadow-md transition-all duration-300 ${
                  plan.popular
                    ? "border-2 border-indigo-500 transform scale-105"
                    : "border border-gray-200 dark:border-gray-600"
                }`}
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  {getPlanPrice(plan)}
                </p>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300 mt-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-0.5">✔</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="mt-8 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-all duration-300 shadow-sm hover:shadow-md">
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faq" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-6">
          <SectionTitle
            title="Frequently Asked Questions"
            subtitle="Find answers to common questions about our platform."
            icon="❓"
          />
          <div className="mt-10 space-y-4">
            {faqData.map((item, index) => (
              <FaqItem
                key={index}
                question={item.question}
                answer={item.answer}
                isOpen={activeFaqs.includes(index)}
                onClick={() => toggleFaq(index)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
