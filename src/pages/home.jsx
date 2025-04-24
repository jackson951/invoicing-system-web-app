import { Link } from "react-router-dom";
import { FaRocket, FaLock, FaUsers } from "react-icons/fa";

const Home = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-6 py-16">
      <div className="max-w-6xl w-full text-center">
        {/* Hero Section */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-6 leading-tight">
          Power Your Business with{" "}
          <span className="text-indigo-600">Smart Invoicing</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          All-in-one SaaS platform to create, send, and track invoices. Get paid
          faster with real-time analytics and seamless Stripe integration.
        </p>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            to="/register"
            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 transition"
          >
            🚀 Get Started
          </Link>
          <Link
            to="/login"
            className="px-8 py-3 border border-indigo-600 text-indigo-600 font-semibold rounded-md hover:bg-indigo-50 transition"
          >
            Log In
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <Feature
            icon={<FaRocket className="text-indigo-600 text-2xl mb-2" />}
            title="Real-Time Dashboard"
            description="Track revenue and client insights live with dynamic charts and visual analytics."
          />
          <Feature
            icon={<FaLock className="text-indigo-600 text-2xl mb-2" />}
            title="Secure Payments"
            description="Accept global payments securely with full Stripe integration for one-time or recurring billing."
          />
          <Feature
            icon={<FaUsers className="text-indigo-600 text-2xl mb-2" />}
            title="Multi-Tenant Access"
            description="Role-based access for Admins, Business Owners, and Accountants across tenants."
          />
        </div>

        {/* Tech Stack Note */}
        <p className="mt-16 text-sm text-gray-400">
          Built with React.js, ASP.NET Core, Tailwind CSS, Stripe, SignalR, and
          more.
        </p>
      </div>
    </div>
  );
};

const Feature = ({ icon, title, description }) => (
  <div className="p-6 border border-gray-200 rounded-lg shadow hover:shadow-lg transition duration-300 bg-white">
    {icon}
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

export default Home;
