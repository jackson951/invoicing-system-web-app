import React, { useState, useEffect } from "react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10); // Limit the number of users per page
  const [sortConfig, setSortConfig] = useState({
    key: "fullName",
    direction: "asc",
  });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("mockUsers")) || [];
    setUsers(data);
  }, []);

  const getBadgeColor = (role) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-red-100 text-red-700";
      case "manager":
        return "bg-yellow-100 text-yellow-700";
      case "user":
      default:
        return "bg-green-100 text-green-700";
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredUsers = sortedUsers.filter((user) =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current users for the current page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">All Users</h2>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* User Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border rounded-lg overflow-hidden">
          <thead className="bg-indigo-100 text-gray-700 uppercase text-sm">
            <tr>
              <th
                className="px-4 py-3 text-left cursor-pointer"
                onClick={() => handleSort("fullName")}
              >
                User
                {sortConfig.key === "fullName" && (
                  <span>{sortConfig.direction === "asc" ? " ↑" : " ↓"}</span>
                )}
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer"
                onClick={() => handleSort("email")}
              >
                Email
                {sortConfig.key === "email" && (
                  <span>{sortConfig.direction === "asc" ? " ↑" : " ↓"}</span>
                )}
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer"
                onClick={() => handleSort("role")}
              >
                Role
                {sortConfig.key === "role" && (
                  <span>{sortConfig.direction === "asc" ? " ↑" : " ↓"}</span>
                )}
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer"
                onClick={() => handleSort("companyName")}
              >
                Company
                {sortConfig.key === "companyName" && (
                  <span>{sortConfig.direction === "asc" ? " ↑" : " ↓"}</span>
                )}
              </th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-4 py-3 flex items-center space-x-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.fullName
                      )}&background=random`}
                      alt="Avatar"
                      className="h-8 w-8 rounded-full"
                    />
                    <span className="font-medium text-gray-900">
                      {user.fullName}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{user.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getBadgeColor(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {user.companyName}
                  </td>
                  <td className="px-4 py-3 text-gray-700 space-x-2">
                    <button className="text-blue-500 hover:underline">
                      Edit
                    </button>
                    <button className="text-red-500 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center px-4 py-6 text-gray-500 italic"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div>
          <p className="text-sm text-gray-700">
            Showing {indexOfFirstUser + 1} to {indexOfLastUser} of{" "}
            {filteredUsers.length} users
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
    </div>
  );
};

export default AdminUsers;
