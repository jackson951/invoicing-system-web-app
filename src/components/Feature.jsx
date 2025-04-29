import React from "react";

const Feature = ({ icon, title, description }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
      <div className="text-3xl text-indigo-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default Feature;
