import React from "react";

const SectionTitle = ({ title, subtitle, icon }) => {
  return (
    <div className="text-center mb-12">
      <div className="text-4xl mb-4">{icon}</div>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        {title}
      </h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
    </div>
  );
};

export default SectionTitle;
