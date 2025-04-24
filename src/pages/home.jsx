import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-6 py-12">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
          Power Your Business with Smart Invoicing
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          A full-featured SaaS platform to create, send, track, and manage
          invoices with real-time analytics and secure payments.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <Link
            to="/register"
            className="px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50 transition"
          >
            Log In
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 text-left">
          <Feature
            title="Real-Time Dashboard"
            description="Track invoices, revenue, and client activity in real-time with integrated charts and analytics."
          />
          <Feature
            title="Secure Payments"
            description="Accept payments globally using Stripe with full support for subscriptions and one-time billing."
          />
          <Feature
            title="Multi-Tenant Support"
            description="Scalable user roles: Admins, Business Owners, and Accountants with permission-based access."
          />
        </div>

        <p className="mt-12 text-sm text-gray-400">
          Built with React.js, ASP.NET Core, Tailwind CSS, Stripe, SignalR, and
          more.
        </p>
      </div>
    </div>
  );
};

const Feature = ({ title, description }) => (
  <div className="p-6 border border-gray-200 rounded shadow-sm hover:shadow-md transition">
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

export default Home;
