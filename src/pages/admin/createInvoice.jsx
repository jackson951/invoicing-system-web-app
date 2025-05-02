import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateInvoice = () => {
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState({
    clientName: "",
    total: "",
    dueDate: "",
    status: "Pending",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoice((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newInvoice = {
      ...invoice,
      id: Date.now().toString(), // Unique ID
    };

    const existingInvoices =
      JSON.parse(localStorage.getItem("mockInvoices")) || [];
    localStorage.setItem(
      "mockInvoices",
      JSON.stringify([...existingInvoices, newInvoice])
    );

    navigate("/admin/invoices"); // Redirect back to invoice list
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Create New Invoice
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Client Name
          </label>
          <input
            type="text"
            name="clientName"
            value={invoice.clientName}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-indigo-500"
            placeholder="e.g. John Doe Inc."
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Total Amount ($)
          </label>
          <input
            type="number"
            name="total"
            value={invoice.total}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-indigo-500"
            placeholder="e.g. 500.00"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Due Date
          </label>
          <input
            type="date"
            name="dueDate"
            value={invoice.dueDate}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Status</label>
          <select
            name="status"
            value={invoice.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-indigo-500"
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate("/admin/invoices")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded"
          >
            Save Invoice
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoice;
