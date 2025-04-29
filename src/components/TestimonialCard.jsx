import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

const TestimonialCard = ({ quote, author, position, rating }) => {
  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
      <div className="p-8 md:p-12">
        <div className="flex mb-6">
          {Array(rating)
            .fill(0)
            .map((_, i) => (
              <FaStar key={i} className="text-yellow-400 text-xl" />
            ))}
          {Array(5 - rating)
            .fill(0)
            .map((_, i) => (
              <FaRegStar key={i} className="text-yellow-400 text-xl" />
            ))}
        </div>
        <blockquote className="text-xl md:text-2xl text-gray-800 font-light italic mb-6">
          "{quote}"
        </blockquote>
        <div className="flex items-center">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
            <span className="text-indigo-600 font-bold">
              {author.charAt(0)}
            </span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">{author}</h4>
            <p className="text-gray-600">{position}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
