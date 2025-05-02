import React from "react";

const RoleInfoCard = ({ role, description, permissions }) => {
  const getRoleIcon = () => {
    switch (role) {
      case "Admin":
        return (
          <svg
            className="w-8 h-8 text-indigo-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 15l8-8m0 0l-8-8m8 8H4"
            />
          </svg>
        );
      case "Business Owner":
        return (
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        );
      case "Accountant":
        return (
          <svg
            className="w-8 h-8 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 h-full">
      <div className="flex items-center mb-4">
        {getRoleIcon()}
        <h3 className="text-xl font-semibold text-gray-800 ml-3">{role}</h3>
      </div>
      <p className="text-gray-600 mb-6">{description}</p>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
          Permissions
        </h4>
        <ul className="space-y-2">
          {permissions.map((permission, index) => (
            <li key={index} className="flex items-start">
              <svg
                className="h-5 w-5 text-green-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-gray-700">{permission}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Need help selecting the right role?{" "}
          <a href="#" className="text-indigo-600 hover:text-indigo-800">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
};

export default RoleInfoCard;
