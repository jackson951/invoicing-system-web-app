// src/components/OtpInput.jsx

import React, { useState, useEffect, useRef } from "react";

const OtpInput = ({ email, onSubmit, isSubmitting, errors, control }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);

  // Auto-focus first input when mounted
  useEffect(() => {
    if (inputs.current[0]) {
      inputs.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }

    // Auto-submit
    const fullOtp = newOtp.join("");
    if (fullOtp.length === 6) {
      onSubmit({ email, otp: fullOtp });
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length === 6) {
      onSubmit({ email, otp: fullOtp });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2 text-center">
          Enter 6-digit Verification Code
        </label>

        <div className="flex justify-between gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputs.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center border border-gray-300 rounded-md text-lg font-semibold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          ))}
        </div>

        {/* Display validation error */}
        {errors?.otp && (
          <p className="mt-2 text-sm text-red-500 text-center">
            {errors.otp.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || otp.join("").length !== 6}
        className={`w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition ${
          isSubmitting || otp.join("").length !== 6
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        {isSubmitting ? "Verifying..." : "Verify OTP"}
      </button>
    </form>
  );
};

export default OtpInput;
