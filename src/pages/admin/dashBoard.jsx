import React, { useState, useEffect } from "react";
import {
  UserGroupIcon,
  DocumentCheckIcon,
  CurrencyDollarIcon,
  BellIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { Sparklines, SparklinesLine, SparklinesBars } from "react-sparklines";
import { faker } from "@faker-js/faker";

// Utility: Generate a fake recent activity entry
const generateActivityItem = () => {
  const type = faker.helpers.arrayElement(["invoice", "payment", "user"]);
  switch (type) {
    case "invoice":
      return `• Invoice #${faker.string
        .alphanumeric({ length: 8 })
        .toUpperCase()} created for ${faker.company.name()}`;
    case "payment":
      return `• Payment of $${faker.number.float({
        min: 50,
        max: 500,
        precision: 2,
      })} received from ${faker.person.fullName()}`;
    case "user":
    default:
      return `• New user registered: ${faker.person.fullName()} (${faker.company.buzzNoun()} ${faker.company.buzzAdjective()})`;
  }
};

const AdminDashboard = () => {
  const [userFullName, setUserFullName] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeInvoices, setActiveInvoices] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = () => {
      // Get the user's full name from localStorage
      const user = JSON.parse(localStorage.getItem("user")); // Assuming the user data is saved as a JSON string
      setUserFullName(user ? user.fullName : "John Doe"); // If no user found in localStorage, fallback to "John Doe"

      setTotalUsers(faker.number.int({ min: 150, max: 300 }));
      setActiveInvoices(faker.number.int({ min: 80, max: 150 }));
      const revenue = faker.number.float({
        min: 10000,
        max: 25000,
        precision: 0,
      });
      setMonthlyRevenue(revenue);
      setRecentActivity(
        Array.from({ length: 5 }, () => generateActivityItem())
      );
      setRevenueData(
        Array.from({ length: 7 }, () =>
          faker.number.float({ min: 1000, max: 4000, precision: 0 })
        )
      );
      setUserGrowthData(
        Array.from({ length: 7 }, () => faker.number.int({ min: 5, max: 20 }))
      );

      setTimeout(() => setLoading(false), 1000);
    };

    fetchDashboardData();

    const intervalId = setInterval(() => {
      setTotalUsers((prev) => prev + faker.number.int({ min: 0, max: 3 }));
      setActiveInvoices((prev) => prev + faker.number.int({ min: -1, max: 2 }));
      setMonthlyRevenue(
        (prev) =>
          prev + faker.number.float({ min: -50, max: 100, precision: 0 })
      );
      setRevenueData((prev) => [
        ...prev.slice(1),
        faker.number.float({ min: 1000, max: 4000, precision: 0 }),
      ]);
      setUserGrowthData((prev) => [
        ...prev.slice(1),
        faker.number.int({ min: 5, max: 20 }),
      ]);
      setRecentActivity((prev) => [
        generateActivityItem(),
        ...prev.slice(0, 4),
      ]);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">Loading dashboard...</div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Welcome, {userFullName} 👋
          </h1>
          <p className="text-gray-600 text-sm">
            Here’s what’s happening with your business today.
          </p>
        </div>
      </header>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <UserGroupIcon className="h-8 w-8 opacity-75" />
          </div>
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="text-4xl font-bold">{totalUsers}</p>
          <p className="text-sm mt-2 opacity-75">
            <ArrowTrendingUpIcon className="h-4 w-4 inline mr-1" />
            {faker.number.int({ min: -5, max: 15 })}% this month
          </p>
        </div>

        {/* Active Invoices */}
        <div className="bg-gradient-to-br from-green-400 to-green-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <DocumentCheckIcon className="h-8 w-8 opacity-75" />
          </div>
          <h3 className="text-lg font-semibold">Active Invoices</h3>
          <p className="text-4xl font-bold">{activeInvoices}</p>
          <p className="text-sm mt-2 opacity-75">
            <ArrowTrendingUpIcon className="h-4 w-4 inline mr-1" />
            {faker.number.int({ min: -10, max: 20 })} new this week
          </p>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <CurrencyDollarIcon className="h-8 w-8 opacity-75" />
          </div>
          <h3 className="text-lg font-semibold">Monthly Revenue</h3>
          <p className="text-4xl font-bold">
            ${monthlyRevenue.toLocaleString()}
          </p>
          <p className="text-sm mt-2 opacity-75">
            <ArrowTrendingUpIcon className="h-4 w-4 inline mr-1" />$
            {faker.number
              .float({ min: -1000, max: 3000, precision: 0 })
              .toLocaleString()}{" "}
            from last month
          </p>
        </div>

        {/* Avg Invoice Value */}
        <div className="bg-gradient-to-br from-purple-400 to-purple-600 text-white p-6 rounded-lg shadow-lg">
          <ChartBarIcon className="h-8 w-8 opacity-75 mb-4" />
          <h3 className="text-lg font-semibold">Avg. Invoice Value</h3>
          <p className="text-4xl font-bold">
            $$
            {activeInvoices > 0
              ? (monthlyRevenue / activeInvoices).toFixed(2)
              : "0.00"}
          </p>
          <p className="text-sm mt-2 opacity-75">Based on current data</p>
        </div>
      </section>

      {/* Graph Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Revenue Trend (7 Days)
            </h3>
            <select className="border rounded px-2 py-1 text-sm text-gray-600">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last Quarter</option>
            </select>
          </div>
          <div className="h-40">
            <Sparklines data={revenueData}>
              <SparklinesLine style={{ stroke: "#2cb67d", fill: "none" }} />
            </Sparklines>
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            User Growth (7 Days)
          </h3>
          <div className="h-40">
            <Sparklines data={userGrowthData}>
              <SparklinesBars style={{ fill: "#60a5fa" }} />
            </Sparklines>
          </div>
        </div>
      </section>

      {/* Activity + Tips */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
            <BellIcon className="h-6 w-6 mr-2 text-gray-500" />
            Recent Activity
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            {recentActivity.map((activity, index) => (
              <li key={index}>{activity}</li>
            ))}
          </ul>
        </div>

        {/* Tips + Goals */}
        <div className="space-y-4">
          <div className="bg-indigo-100 border-l-4 border-indigo-500 p-4 rounded-md shadow-sm">
            <p className="text-indigo-700 font-semibold">🚀 Quick Tip:</p>
            <p className="text-indigo-600 text-sm">
              Regularly check your active invoices to ensure timely payments.
            </p>
          </div>

          <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded-md shadow-sm">
            <p className="text-green-700 font-semibold">💰 Revenue Goal:</p>
            <p className="text-green-600 text-sm">
              You are 85% towards your monthly goal of $20,000.
            </p>
            <div className="bg-green-200 rounded-full h-2 mt-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: "85%" }}
              ></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
