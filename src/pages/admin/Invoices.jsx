import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline"; // Import icons

const AdminInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);

  const invoicesPerPage = 10;

  // Fetching data from local storage or real API (for now, we're simulating with local storage)
  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        // Replace with real API call
        const data = JSON.parse(localStorage.getItem("mockInvoices")) || [];
        setInvoices(data);
      } catch (error) {
        console.error("Error fetching invoices", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleDeleteInvoice = () => {
    const updatedInvoices = invoices.filter(
      (inv) => inv.id !== invoiceToDelete
    );
    setInvoices(updatedInvoices);
    localStorage.setItem("mockInvoices", JSON.stringify(updatedInvoices));
    setShowDeleteConfirmation(false); // Close confirmation dialog
    setInvoiceToDelete(null); // Clear the invoice to delete
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

  // Pagination logic
  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = sortedInvoices.slice(
    indexOfFirstInvoice,
    indexOfLastInvoice
  );
  const totalPages = Math.ceil(sortedInvoices.length / invoicesPerPage);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All Invoices</h2>
        <Link
          to="/admin/invoices/create"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Create New Invoice
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search invoices..."
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
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
          {loading ? (
            <tr>
              <td colSpan="6" className="px-4 py-2 text-center text-gray-500">
                Loading...
              </td>
            </tr>
          ) : (
            currentInvoices.map((inv) => (
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
                    onClick={() => {
                      setInvoiceToDelete(inv.id);
                      setShowDeleteConfirmation(true);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))
          )}
          {sortedInvoices.length === 0 && !loading && (
            <tr>
              <td colSpan="6" className="px-4 py-2 text-center text-gray-500">
                No invoices found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div>
          <p className="text-sm text-gray-700">
            Showing {indexOfFirstInvoice + 1} to {indexOfLastInvoice} of{" "}
            {sortedInvoices.length} invoices
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(1)}
            className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 disabled:bg-gray-300"
            disabled={currentPage === 1}
          >
            First
          </button>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 disabled:bg-gray-300"
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 disabled:bg-gray-300"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 disabled:bg-gray-300"
            disabled={currentPage === totalPages}
          >
            Last
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow">
            <p>Are you sure you want to delete this invoice?</p>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={handleDeleteInvoice}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInvoices;
