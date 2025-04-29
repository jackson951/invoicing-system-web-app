import React from "react";

const ProcessStep = ({ number, title, description, isLeft }) => {
  return (
    <div
      className={`md:flex items-center ${
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      } mb-16`}
    >
      <div
        className={`md:w-1/2 ${
          isLeft ? "md:text-right md:pr-12" : "md:text-left md:pl-12"
        } mb-6 md:mb-0`}
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="md:w-1/2 flex justify-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold relative z-10">
            {number}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessStep;
