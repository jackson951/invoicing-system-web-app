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

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeInvoices, setActiveInvoices] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = () => {
      setTotalUsers(faker.number.int({ min: 150, max: 300 }));
      setActiveInvoices(faker.number.int({ min: 80, max: 150 }));
      setMonthlyRevenue(
        faker.number.float({ min: 10000, max: 25000, precision: 0 })
      );

      const activity = Array.from({ length: 5 }, () => {
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
            return `• New user registered: ${faker.person.fullName()} (${faker.company.buzzNoun()} ${faker.company.buzzAdjective()})`;
          default:
            return "";
        }
      });
      setRecentActivity(activity);

      const revenue = Array.from({ length: 7 }, () =>
        faker.number.float({ min: 1000, max: 4000, precision: 0 })
      );
      setRevenueData(revenue);

      const users = Array.from({ length: 7 }, () =>
        faker.number.int({ min: 5, max: 20 })
      );
      setUserGrowthData(users);
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
        faker.helpers.arrayElement(["invoice", "payment", "user"]) === "invoice"
          ? `• Invoice #${faker.string
              .alphanumeric({ length: 8 })
              .toUpperCase()} created for ${faker.company.name()}`
          : faker.helpers.arrayElement(["payment", "user"]) === "payment"
          ? `• Payment of $${faker.number.float({
              min: 50,
              max: 500,
              precision: 2,
            })} received from ${faker.person.fullName()}`
          : `• New user registered: ${faker.person.fullName()} (${faker.company.buzzNoun()} ${faker.company.buzzAdjective()})`,
        ...prev.slice(0, 4),
      ]);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Overview Cards */}
      <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 text-white p-6 rounded-lg shadow-xl transform transition-transform hover:scale-105">
        <div className="flex items-center justify-between mb-4">
          <UserGroupIcon className="h-8 w-8 opacity-75" />
          <BellIcon className="h-6 w-6 opacity-75" />
        </div>
        <h3 className="text-lg font-semibold mb-1">Total Users</h3>
        <p className="text-4xl font-bold">{totalUsers}</p>
        <p className="text-sm mt-2 opacity-75">
          <ArrowTrendingUpIcon className="h-4 w-4 inline-block mr-1 align-middle" />
          {faker.number.int({ min: -5, max: 15 })}% growth this month
        </p>
      </div>

      <div className="bg-gradient-to-br from-green-400 to-green-600 text-white p-6 rounded-lg shadow-xl transform transition-transform hover:scale-105">
        <div className="flex items-center justify-between mb-4">
          <DocumentCheckIcon className="h-8 w-8 opacity-75" />
        </div>
        <h3 className="text-lg font-semibold mb-1">Active Invoices</h3>
        <p className="text-4xl font-bold">{activeInvoices}</p>
        <p className="text-sm mt-2 opacity-75">
          <ArrowTrendingUpIcon className="h-4 w-4 inline-block mr-1 align-middle" />
          {faker.number.int({ min: -10, max: 20 })} new invoices this week
        </p>
      </div>

      <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white p-6 rounded-lg shadow-xl transform transition-transform hover:scale-105">
        <div className="flex items-center justify-between mb-4">
          <CurrencyDollarIcon className="h-8 w-8 opacity-75" />
        </div>
        <h3 className="text-lg font-semibold mb-1">Monthly Revenue</h3>
        <p className="text-4xl font-bold">${monthlyRevenue.toLocaleString()}</p>
        <p className="text-sm mt-2 opacity-75">
          <ArrowTrendingUpIcon className="h-4 w-4 inline-block mr-1 align-middle" />
          $
          {faker.number
            .float({ min: -1000, max: 3000, precision: 0 })
            .toLocaleString()}{" "}
          change from last month
        </p>
      </div>

      {/* Revenue Chart */}
      <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-xl">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <ChartBarIcon className="h-6 w-6 mr-2 text-gray-500" /> Revenue Trend
          (Last 7 Days)
        </h3>
        <div className="h-48">
          <Sparklines data={revenueData}>
            <SparklinesLine style={{ stroke: "#2cb67d", fill: "none" }} />
          </Sparklines>
        </div>
        <div className="flex justify-around mt-4 text-sm text-gray-600">
          {revenueData.map((value, index) => (
            <span key={index}>
              Day {index + 1}: ${value.toFixed(0)}
            </span>
          ))}
        </div>
      </div>

      {/* User Growth */}
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <UserGroupIcon className="h-6 w-6 mr-2 text-gray-500" /> User Growth
          (Last 7 Days)
        </h3>
        <div className="h-48">
          <Sparklines data={userGrowthData}>
            <SparklinesBars style={{ fill: "#60a5fa" }} />
          </Sparklines>
        </div>
        <div className="flex justify-around mt-4 text-sm text-gray-600">
          {userGrowthData.map((value, index) => (
            <span key={index}>
              Day {index + 1}: +{value}
            </span>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="md:col-span-3 bg-white p-6 rounded-lg shadow-xl">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <BellIcon className="h-6 w-6 mr-2 text-gray-500" /> Recent Activity
        </h3>
        <ul className="space-y-3">
          {recentActivity.map((activity, index) => (
            <li key={index} className="text-gray-700">
              {activity}
            </li>
          ))}
        </ul>
        <button className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-semibold">
          View All Activity
        </button>
      </div>

      {/* Tips & Goals */}
      <div className="bg-indigo-100 border-l-4 border-indigo-500 p-4 rounded-md shadow-sm">
        <p className="text-indigo-700 font-semibold">🚀 Quick Tip:</p>
        <p className="text-indigo-600 text-sm">
          Regularly check your active invoices to ensure timely payments.
        </p>
      </div>

      <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded-md shadow-sm">
        <p className="text-green-700 font-semibold">💰 Revenue Goal:</p>
        <p className="text-green-600 text-sm">
          You are 85% towards your monthly revenue goal of $20,000.
        </p>
        <div className="bg-green-200 rounded-full h-2 mt-2">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: "85%" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
