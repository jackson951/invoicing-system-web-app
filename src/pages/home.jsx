import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaRocket,
  FaLock,
  FaUsers,
  FaFileInvoiceDollar,
  FaChartLine,
  FaCreditCard,
  FaTools,
  FaEnvelopeOpenText,
  FaCogs,
  FaCheckCircle,
  FaQuestionCircle,
  FaChevronRight,
  FaStar,
  FaRegStar,
  FaEnvelope,
  FaArrowRight,
  FaCommentDollar,
  FaGlobe,
  FaMobileAlt,
  FaArrowUp,
} from "react-icons/fa";

// Feature Component
const Feature = ({ icon, title, description }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
      <div className="text-3xl text-indigo-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

// Section Title Component
const SectionTitle = ({ title, subtitle, icon }) => {
  return (
    <div className="text-center mb-12">
      <div className="text-4xl mb-4">{icon}</div>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        {title}
      </h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
    </div>
  );
};

// Process Step Component
const ProcessStep = ({ number, title, description, isLeft }) => {
  return (
    <div
      className={`md:flex items-center ${
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      } mb-16`}
    >
      <div
        className={`md:w-1/2 ${
          isLeft ? "md:text-right md:pr-12" : "md:text-left md:pl-12"
        } mb-6 md:mb-0`}
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="md:w-1/2 flex justify-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold relative z-10">
            {number}
          </div>
        </div>
      </div>
    </div>
  );
};

// UseCase Component
const UseCase = ({ icon, title, description }) => {
  return (
    <div className="flex">
      <div className="mr-4 mt-1 text-2xl">{icon}</div>
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

// FAQ Item Component
const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        className="flex justify-between items-center w-full text-left py-4 font-semibold"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg">{question}</span>
        <FaQuestionCircle
          className={`text-indigo-600 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <p className="text-gray-600 pb-4">{answer}</p>
      </div>
    </div>
  );
};

const Home = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [pricingPeriod, setPricingPeriod] = useState("monthly");

  // Monitor scroll position for floating nav and scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
        setShowScrollTop(window.scrollY > 600);
      } else {
        setScrolled(false);
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Stats counter animation (simulated)
  const [stats, setStats] = useState({
    customers: 0,
    invoices: 0,
    payments: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        customers: prev.customers < 2500 ? prev.customers + 25 : prev.customers,
        invoices: prev.invoices < 68000 ? prev.invoices + 680 : prev.invoices,
        payments:
          prev.payments < 15000000 ? prev.payments + 150000 : prev.payments,
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const testimonials = [
    {
      quote:
        "Since implementing this platform, we've reduced our billing cycle by 60% and virtually eliminated late payments. The automated reminders alone are worth the investment.",
      author: "Sarah Johnson",
      position: "Finance Director, TechGrowth Inc.",
      rating: 5,
    },
    {
      quote:
        "As a freelancer juggling multiple clients, this invoicing system has been a game-changer. I've actually calculated that I save about 8 hours per month on invoice creation and payment tracking.",
      author: "Marcus Chen",
      position: "Independent Design Consultant",
      rating: 5,
    },
    {
      quote:
        "The multi-tenant feature lets us manage billing for all our subsidiary companies from one central dashboard. Reporting that used to take days now happens in real-time.",
      author: "Jessica Williams",
      position: "CFO, Horizon Group",
      rating: 4,
    },
  ];

  const plans = [
    {
      name: "Starter",
      monthlyPrice: 19,
      annualPrice: 190,
      features: [
        "Up to 20 invoices/month",
        "2 user accounts",
        "Email support",
        "Basic analytics",
        "PDF invoice generation",
        "Single tenant",
      ],
      cta: "Start Free Trial",
    },
    {
      name: "Professional",
      popular: true,
      monthlyPrice: 49,
      annualPrice: 490,
      features: [
        "Unlimited invoices",
        "10 user accounts",
        "Priority support",
        "Advanced analytics & reporting",
        "Custom invoice templates",
        "Up to 3 tenants",
        "Automated reminders",
        "Client portal",
      ],
      cta: "Start Free Trial",
    },
    {
      name: "Enterprise",
      monthlyPrice: 99,
      annualPrice: 990,
      features: [
        "Everything in Professional",
        "Unlimited user accounts",
        "Dedicated support manager",
        "Custom integrations",
        "API access",
        "Unlimited tenants",
        "Advanced security features",
        "White-labeling options",
      ],
      cta: "Contact Sales",
    },
  ];

  return (
    <div className="min-h-screen bg-white relative">
      {/* Floating Navigation */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${
          scrolled ? "shadow-md py-2" : "py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-indigo-600">
              InvoicePro
            </span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a
              href="#features"
              className="text-gray-600 hover:text-indigo-600 transition"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-gray-600 hover:text-indigo-600 transition"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="text-gray-600 hover:text-indigo-600 transition"
            >
              Testimonials
            </a>
            <a
              href="#faq"
              className="text-gray-600 hover:text-indigo-600 transition"
            >
              FAQ
            </a>
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

      {/* Main Content with padding for floating nav */}
      <div className="pt-24">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto text-center px-6 py-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Transform the Way You{" "}
            <span className="text-indigo-600">Invoice</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Modern businesses need more than just invoice templates. They need
            automation, analytics, and flexibility — all in one secure, scalable
            platform. That's where we come in.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/register"
              className="px-10 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-md shadow hover:bg-indigo-700 transition flex items-center justify-center gap-2"
            >
              <span>Start Invoicing Smarter</span>
              <FaRocket />
            </Link>
            <Link
              to="/demo"
              className="px-10 py-4 bg-white text-indigo-600 border border-indigo-600 text-lg font-semibold rounded-md hover:bg-indigo-50 transition flex items-center justify-center gap-2"
            >
              <span>Watch Demo</span>
              <FaChevronRight />
            </Link>
          </div>

          {/* Hero Image */}
          <div className="relative mt-10 mb-20 bg-gray-100 p-4 rounded-xl shadow-lg">
            <div className="absolute -top-4 -right-4 bg-indigo-600 text-white text-sm font-bold px-3 py-1 rounded-full">
              Dashboard Preview
            </div>
            <div className="bg-white rounded-lg overflow-hidden shadow-inner border border-gray-200">
              <div className="h-96 bg-indigo-50 flex items-center justify-center">
                <p className="text-gray-500">
                  Dashboard Screenshot Placeholder
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Counter */}
        <div className="bg-indigo-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              Trusted by Businesses Worldwide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stats.customers.toLocaleString()}+
                </div>
                <div className="text-indigo-200">Active Customers</div>
              </div>
              <div className="p-6">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stats.invoices.toLocaleString()}+
                </div>
                <div className="text-indigo-200">Invoices Generated</div>
              </div>
              <div className="p-6">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  ${(stats.payments / 1000000).toFixed(1)}M+
                </div>
                <div className="text-indigo-200">Payments Processed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div id="features" className="max-w-7xl mx-auto px-6 py-20">
          <SectionTitle
            title="What You Get With Our Platform"
            subtitle="Powerful tools designed to make invoicing effortless and insightful"
            icon="📦"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left mt-10">
            <Feature
              icon={<FaFileInvoiceDollar />}
              title="Smart Invoice Management"
              description="Design and send beautiful invoices in seconds. Duplicate past invoices, automate scheduling, and track payments with real-time updates."
            />
            <Feature
              icon={<FaCreditCard />}
              title="Integrated Payments"
              description="Built-in Stripe integration means your clients can pay securely, instantly. Supports subscriptions, one-time payments, and automatic receipts."
            />
            <Feature
              icon={<FaChartLine />}
              title="Live Analytics Dashboard"
              description="Visualize income, overdue invoices, and trends. Custom charts powered by Chart.js + SignalR update as transactions happen."
            />
            <Feature
              icon={<FaLock />}
              title="Enterprise-Grade Security"
              description="Role-based access, password recovery, email verification, and full authentication via ASP.NET Identity ensure data stays protected."
            />
            <Feature
              icon={<FaUsers />}
              title="Multi-Tenant System"
              description="Run multiple businesses or clients under one account. Each tenant gets isolated data, roles, and branded invoices."
            />
            <Feature
              icon={<FaEnvelopeOpenText />}
              title="Automated Email Workflows"
              description="Schedule reminders, send payment confirmations, and customize email templates without writing a single line of code."
            />
            <Feature
              icon={<FaTools />}
              title="PDF Invoice Generation"
              description="Generate downloadable PDF invoices using server-side rendering tools like iTextSharp. Designed for clarity and brand consistency."
            />
            <Feature
              icon={<FaCogs />}
              title="Admin Control Panel"
              description="Admins can manage tenants, oversee transactions, set permissions, and audit activity from a powerful backend dashboard."
            />
            <Feature
              icon={<FaRocket />}
              title="Scalable Infrastructure"
              description="Built on ASP.NET Core + SQL Server for performance and reliability. Ready to scale with your business needs."
            />
          </div>
        </div>

        {/* Process Flow */}
        <div className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <SectionTitle
              title="How It Works"
              subtitle="Get started in minutes with our streamlined onboarding process"
              icon="🔄"
            />

            <div className="relative mt-20">
              {/* Process timeline */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-indigo-200 transform -translate-x-1/2"></div>

              {/* Steps */}
              <div className="space-y-20 md:space-y-0">
                <ProcessStep
                  number={1}
                  title="Sign Up & Create Your Account"
                  description="Complete our simple registration process and verify your email to get instant access to your dashboard."
                  isLeft={true}
                />

                <ProcessStep
                  number={2}
                  title="Configure Your Business Profile"
                  description="Add your company details, logo, and payment information to customize your invoicing experience."
                  isLeft={false}
                />

                <ProcessStep
                  number={3}
                  title="Create Your First Invoice"
                  description="Use our intuitive interface to create professional invoices. Add items, set tax rates, and include payment terms."
                  isLeft={true}
                />

                <ProcessStep
                  number={4}
                  title="Send & Get Paid"
                  description="Send invoices directly to clients via email. They'll receive a professional PDF and a secure payment link."
                  isLeft={false}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div id="pricing" className="max-w-7xl mx-auto px-6 py-20">
          <SectionTitle
            title="Simple, Transparent Pricing"
            subtitle="Choose the plan that fits your business needs"
            icon="💰"
          />

          {/* Billing toggle */}
          <div className="flex justify-center items-center space-x-4 mb-12">
            <span
              className={`text-lg ${
                pricingPeriod === "monthly"
                  ? "text-indigo-600 font-semibold"
                  : "text-gray-500"
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() =>
                setPricingPeriod((prev) =>
                  prev === "monthly" ? "annual" : "monthly"
                )
              }
              className="relative inline-flex h-8 w-16 items-center rounded-full bg-indigo-200"
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-indigo-600 transition ${
                  pricingPeriod === "annual" ? "translate-x-9" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`text-lg ${
                pricingPeriod === "annual"
                  ? "text-indigo-600 font-semibold"
                  : "text-gray-500"
              }`}
            >
              Annual{" "}
              <span className="text-green-600 text-sm font-medium">
                Save 20%
              </span>
            </span>
          </div>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-lg shadow-lg overflow-hidden border ${
                  plan.popular
                    ? "border-indigo-500 transform md:-translate-y-4"
                    : "border-gray-200"
                }`}
              >
                {plan.popular && (
                  <div className="bg-indigo-500 text-white text-center py-2 font-semibold">
                    Most Popular
                  </div>
                )}
                <div className="p-6 bg-white">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {plan.name}
                  </h3>
                  <div className="mt-4 mb-6">
                    <div className="flex items-end">
                      <span className="text-4xl font-bold text-gray-900">
                        $
                        {pricingPeriod === "monthly"
                          ? plan.monthlyPrice
                          : plan.annualPrice}
                      </span>
                      <span className="text-gray-600 ml-2">
                        /{pricingPeriod === "monthly" ? "month" : "year"}
                      </span>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={plan.name === "Enterprise" ? "/contact" : "/register"}
                    className={`w-full py-3 text-center rounded-md font-semibold block ${
                      plan.popular
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    } transition duration-300`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10 text-gray-600">
            All plans include a 14-day free trial. No credit card required.
          </div>
        </div>

        {/* Tech Stack */}
        {/* <div className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <SectionTitle
              title="Powered by Proven Technologies"
              subtitle="Enterprise-grade stack built for performance and reliability"
              icon="🧠"
            />

            <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {[
                "React",
                "ASP.NET Core",
                "SignalR",
                "Stripe",
                "Tailwind CSS",
                "Chart.js",
              ].map((tech, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-md"
                >
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-indigo-600 font-bold">
                      {tech.charAt(0)}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-800">{tech}</h4>
                </div>
              ))}
            </div>

            <div className="text-gray-700 text-md max-w-4xl mx-auto mt-12 leading-relaxed bg-white p-6 rounded-lg shadow-sm">
              <p>
                Built using <strong>React.js</strong> and{" "}
                <strong>Tailwind CSS</strong> for an exceptional frontend
                experience. Backed by <strong>ASP.NET Core</strong> and{" "}
                <strong>Entity Framework Core</strong> for secure, scalable
                APIs. Real-time data flows through <strong>SignalR</strong>,
                payments run via <strong>Stripe API</strong>, and PDF documents
                are crafted using <strong>iTextSharp</strong>.
              </p>
              <p className="mt-4">
                Every part of our stack is chosen to deliver performance,
                developer productivity, and future-proof extensibility — making
                it the ideal choice for modern businesses and startups alike.
              </p>
            </div>
          </div>
        </div> */}

        {/* Testimonials */}
        <div id="testimonials" className="max-w-7xl mx-auto px-6 py-20">
          <SectionTitle
            title="What Our Customers Say"
            subtitle="Success stories from businesses like yours"
            icon="💬"
          />

          <div className="mt-16 relative">
            {/* Testimonial Carousel */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="p-8 md:p-12">
                <div className="flex mb-6">
                  {Array(testimonials[activeTestimonial].rating)
                    .fill(0)
                    .map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 text-xl" />
                    ))}
                  {Array(5 - testimonials[activeTestimonial].rating)
                    .fill(0)
                    .map((_, i) => (
                      <FaRegStar key={i} className="text-yellow-400 text-xl" />
                    ))}
                </div>

                <blockquote className="text-xl md:text-2xl text-gray-800 font-light italic mb-6">
                  "{testimonials[activeTestimonial].quote}"
                </blockquote>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-indigo-600 font-bold">
                      {testimonials[activeTestimonial].author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {testimonials[activeTestimonial].author}
                    </h4>
                    <p className="text-gray-600">
                      {testimonials[activeTestimonial].position}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Indicator dots */}
            <div className="flex justify-center mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`w-3 h-3 mx-1 rounded-full ${
                    activeTestimonial === idx ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-indigo-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <SectionTitle
              title="Built for Modern Businesses"
              subtitle="Solutions tailored to your specific industry needs"
              icon="🌍"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 text-left max-w-4xl mx-auto mt-12">
              <UseCase
                icon={<FaCommentDollar className="text-indigo-600" />}
                title="Freelancers & Consultants"
                description="Send polished, professional invoices and get paid faster. Track billable hours and expenses while maintaining a professional image with clients."
              />
              <UseCase
                icon={<FaGlobe className="text-indigo-600" />}
                title="SaaS & Subscription Companies"
                description="Bill your clients on a schedule and track MRR with built-in analytics. Automate recurring invoices and gain insights into your revenue streams."
              />
              <UseCase
                icon={<FaFileInvoiceDollar className="text-indigo-600" />}
                title="Accounting Teams"
                description="Manage multiple client accounts and generate financial records in one place. Create detailed reports and ensure compliance with tax regulations."
              />
              <UseCase
                icon={<FaMobileAlt className="text-indigo-600" />}
                title="Agencies & Studios"
                description="Create client-specific invoice templates, assign team roles, and monitor project payments. Scale your billing process as your agency grows."
              />
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="max-w-7xl mx-auto px-6 py-20">
          <SectionTitle
            title="Frequently Asked Questions"
            subtitle="Find answers to common questions about our platform"
            icon="❓"
          />

          <div className="mt-12 max-w-4xl mx-auto space-y-6">
            <FaqItem
              question="How does the 14-day free trial work?"
              answer="Our free trial gives you full access to all features of your selected plan for 14 days. No credit card is required to start. You'll receive a reminder 3 days before your trial ends with options to subscribe or cancel."
            />
            <FaqItem
              question="Can I switch plans later?"
              answer="Yes, you can upgrade or downgrade your plan at any time. When upgrading, the new features are instantly available and we'll prorate your billing. When downgrading, changes take effect at the end of your current billing cycle."
            />
            <FaqItem
              question="What payment methods do you accept?"
              answer="We accept all major credit cards (Visa, Mastercard, American Express, Discover) as well as PayPal. For Enterprise plans, we can also accommodate bank transfers and purchase orders."
            />
            <FaqItem
              question="Is my data secure?"
              answer="Absolutely. We implement bank-level security with 256-bit SSL encryption for all data transfers. Your data is stored in SOC 2 compliant data centers with regular backups. We never share your data with third parties."
            />
            <FaqItem
              question="Can I import existing client data?"
              answer="Yes, our platform supports importing client data and invoice history via CSV files. For larger migrations, our Enterprise plan includes personalized onboarding assistance to ensure a smooth transition."
            />
          </div>
        </div>

        {/* Final Trust Statement */}
        <div className="bg-indigo-900 text-white py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h3 className="text-3xl font-bold mb-6">
              Ready to transform your invoicing process?
            </h3>
            <p className="text-indigo-200 text-lg mb-10 max-w-2xl mx-auto">
              Whether you're a freelancer, agency, or enterprise — our platform
              helps you look professional, save time, and get paid faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-10 py-4 bg-white text-indigo-900 text-lg font-semibold rounded-md shadow hover:bg-gray-100 transition flex items-center justify-center gap-2"
              >
                <span>Start Your Free Trial</span>
                <FaArrowRight />
              </Link>
              <Link
                to="/contact"
                className="px-10 py-4 bg-transparent text-white border border-white text-lg font-semibold rounded-md hover:bg-indigo-800 transition flex items-center justify-center gap-2"
              >
                <span>Schedule a Demo</span>
                <FaEnvelope />
              </Link>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="bg-indigo-50 rounded-xl shadow-md p-8 md:p-12">
            <div className="md:flex items-center justify-between">
              <div className="md:w-2/3 mb-6 md:mb-0">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Stay updated with invoicing trends
                </h3>
                <p className="text-gray-600">
                  Join our newsletter for tips, updates, and early access to new
                  features.
                </p>
              </div>
              <div className="md:w-1/3">
                <form className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-grow px-4 py-3 rounded-l-md border-t border-b border-l border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 transition"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={handleScrollToTop}
          className="fixed bottom-8 right-8 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition z-40"
          aria-label="Scroll to top"
        >
          <FaArrowUp />
        </button>
      )}
    </div>
  );
};

export default Home;
