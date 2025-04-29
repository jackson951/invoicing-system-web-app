import React, { useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        className="flex justify-between items-center w-full text-left py-4 font-semibold"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg">{question}</span>
        <FaQuestionCircle
          className={`text-indigo-600 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <p className="text-gray-600 pb-4">{answer}</p>
      </div>
    </div>
  );
};

export default FaqItem;
