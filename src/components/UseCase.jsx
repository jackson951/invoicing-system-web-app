import React from "react";

const UseCase = ({ icon, title, description }) => {
  return (
    <div className="flex">
      <div className="mr-4 mt-1 text-2xl">{icon}</div>
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default UseCase;
