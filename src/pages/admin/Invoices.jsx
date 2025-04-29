import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline"; // Import icons

const AdminInvoices = () => {
  const [invoices, setInvoices] = useState(() => {
    return JSON.parse(localStorage.getItem("mockInvoices")) || [];
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const handleDeleteInvoice = (id) => {
    const updatedInvoices = invoices.filter((inv) => inv.id !== id);
    setInvoices(updatedInvoices);
    localStorage.setItem("mockInvoices", JSON.stringify(updatedInvoices));
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedInvoices = React.useMemo(() => {
    let sortableInvoices = [...invoices];
    if (sortConfig.key !== null) {
      sortableInvoices.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableInvoices.filter((inv) =>
      Object.values(inv).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [invoices, sortConfig, searchTerm]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All Invoices</h2>
        <Link
          to="/admin/invoices/create"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Create New Invoice
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search invoices..."
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="min-w-full table-auto">
        <thead>
          <tr className="border-b">
            <th
              className="px-4 py-2 text-left cursor-pointer"
              onClick={() => handleSort("id")}
            >
              Invoice ID{" "}
              {sortConfig.key === "id" &&
                (sortConfig.direction === "ascending" ? "▲" : "▼")}
            </th>
            <th
              className="px-4 py-2 text-left cursor-pointer"
              onClick={() => handleSort("clientName")}
            >
              Client{" "}
              {sortConfig.key === "clientName" &&
                (sortConfig.direction === "ascending" ? "▲" : "▼")}
            </th>
            <th
              className="px-4 py-2 text-left cursor-pointer"
              onClick={() => handleSort("total")}
            >
              Total{" "}
              {sortConfig.key === "total" &&
                (sortConfig.direction === "ascending" ? "▲" : "▼")}
            </th>
            <th
              className="px-4 py-2 text-left cursor-pointer"
              onClick={() => handleSort("dueDate")}
            >
              Due Date{" "}
              {sortConfig.key === "dueDate" &&
                (sortConfig.direction === "ascending" ? "▲" : "▼")}
            </th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedInvoices.map((inv) => (
            <tr key={inv.id} className="border-b">
              <td className="px-4 py-2">{inv.id}</td>
              <td className="px-4 py-2">{inv.clientName}</td>
              <td className="px-4 py-2">${inv.total}</td>
              <td className="px-4 py-2">{inv.dueDate}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded ${
                    inv.status === "Paid"
                      ? "bg-green-100 text-green-800"
                      : inv.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {inv.status}
                </span>
              </td>
              <td className="px-4 py-2">
                <Link
                  to={`/admin/invoices/edit/${inv.id}`}
                  className="text-indigo-600 hover:text-indigo-800 mr-2"
                >
                  <PencilIcon className="h-5 w-5" />
                </Link>
                <button
                  onClick={() => handleDeleteInvoice(inv.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
          {sortedInvoices.length === 0 && (
            <tr>
              <td colSpan="6" className="px-4 py-2 text-center">
                No invoices found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminInvoices;
