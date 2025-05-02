import React, { useState, useEffect, useRef } from "react";
import { FiRefreshCw, FiCheck, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const OtpInput = ({
  email,
  onSubmit,
  isSubmitting,
  errors,
  onResendOtp,
  resendDisabled,
  timer,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState(null);
  const inputs = useRef([]);

  useEffect(() => {
    if (inputs.current[0]) {
      inputs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    if (errors?.otp) {
      setError(errors.otp.message);
      // Clear error after 5 seconds
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }

    const fullOtp = newOtp.join("");
    if (fullOtp.length === 6) {
      setIsComplete(true);
    } else {
      setIsComplete(false);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text/plain").trim();
    if (pasteData.length === 6 && !isNaN(pasteData)) {
      const pasteArray = pasteData.split("");
      setOtp(pasteArray);
      setIsComplete(true);
      inputs.current[5].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length === 6) {
      onSubmit({ email, otp: fullOtp });
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Verify Your Email
        </h3>
        <p className="text-sm text-gray-600">
          We've sent a 6-digit code to{" "}
          <span className="font-medium">{email}</span>
        </p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded"
          >
            <div className="flex items-center">
              <FiX className="text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
            Enter verification code
          </label>

          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className={`w-12 h-12 text-center border rounded-lg text-xl font-semibold focus:ring-2 focus:outline-none transition-all ${
                  isComplete
                    ? "border-green-500 focus:ring-green-200 focus:border-green-500"
                    : "border-gray-300 focus:ring-indigo-200 focus:border-indigo-500"
                }`}
                disabled={isSubmitting}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2">
          <button
            type="button"
            onClick={onResendOtp}
            disabled={resendDisabled || isSubmitting}
            className={`text-sm flex items-center ${
              resendDisabled
                ? "text-gray-400 cursor-not-allowed"
                : "text-indigo-600 hover:text-indigo-800"
            }`}
          >
            <FiRefreshCw
              className={`mr-1 ${
                resendDisabled ? "" : "animate-spin-on-hover"
              }`}
            />
            Resend OTP
          </button>
          {resendDisabled && (
            <span className="text-sm text-gray-500">({formatTime(timer)})</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !isComplete}
          className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-all ${
            isComplete
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          } ${isSubmitting ? "opacity-75" : ""}`}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Verifying...
            </>
          ) : (
            <>
              {isComplete && <FiCheck className="mr-2" />}
              Verify Code
            </>
          )}
        </button>
      </form>

      <div className="text-center text-sm text-gray-500">
        Didn't receive the code? Check your spam folder or{" "}
        <button
          type="button"
          onClick={onResendOtp}
          disabled={resendDisabled || isSubmitting}
          className={`font-medium ${
            resendDisabled
              ? "text-gray-400 cursor-not-allowed"
              : "text-indigo-600 hover:text-indigo-800"
          }`}
        >
          resend it
        </button>
      </div>
    </div>
  );
};

export default OtpInput;
