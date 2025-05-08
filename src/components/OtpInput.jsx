import React, { useState, useEffect, useRef } from "react";
import { FiRefreshCw, FiCheck, FiX, FiClock, FiLock } from "react-icons/fi";
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
  const [focusedIndex, setFocusedIndex] = useState(0);
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
      setFocusedIndex(index + 1);
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
      setFocusedIndex(index - 1);
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
      setFocusedIndex(5);
    }
  };

  const handleFocus = (index) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(null);
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
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 mb-2">
          Secure Verification
        </h3>
        <p className="text-gray-400">
          We've sent a 6-digit code to{" "}
          <span className="font-medium text-indigo-300">{email}</span>
        </p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-red-900/50 border-l-4 border-red-400 p-4 mb-4 rounded-lg"
          >
            <div className="flex items-center">
              <FiX className="text-red-400 mr-2" />
              <p className="text-red-100">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-4 text-center">
            Enter your verification code
          </label>

          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
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
                  onFocus={() => handleFocus(index)}
                  onBlur={handleBlur}
                  className={`w-14 h-14 text-center border-2 rounded-xl text-2xl font-bold focus:outline-none transition-all ${
                    isComplete
                      ? "border-green-500 bg-green-500/10"
                      : focusedIndex === index
                      ? "border-indigo-500 bg-indigo-500/10"
                      : "border-gray-600 bg-gray-700/50"
                  } ${digit ? "text-white" : "text-gray-400"} ${
                    isSubmitting ? "opacity-70" : ""
                  }`}
                  disabled={isSubmitting}
                />
                {focusedIndex === index && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 rounded-b"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center space-x-3">
          <button
            type="button"
            onClick={onResendOtp}
            disabled={resendDisabled || isSubmitting}
            className={`text-sm flex items-center ${
              resendDisabled
                ? "text-gray-500 cursor-not-allowed"
                : "text-indigo-400 hover:text-indigo-300"
            }`}
          >
            <FiRefreshCw
              className={`mr-2 ${resendDisabled ? "" : "hover:animate-spin"}`}
            />
            Resend Code
          </button>
          {resendDisabled && (
            <div className="flex items-center text-sm text-gray-500">
              <FiClock className="mr-1" />
              <span>{formatTime(timer)}</span>
            </div>
          )}
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting || !isComplete}
          whileHover={!isSubmitting && isComplete ? { scale: 1.02 } : {}}
          whileTap={!isSubmitting && isComplete ? { scale: 0.98 } : {}}
          className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center transition-all ${
            isComplete
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
              : "bg-gray-700 text-gray-500 cursor-not-allowed"
          } ${isSubmitting ? "opacity-80" : ""}`}
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
              Verify & Continue
            </>
          )}
        </motion.button>
      </form>

      <div className="text-center text-sm text-gray-500">
        Didn't receive the code? Check your spam folder or{" "}
        <button
          type="button"
          onClick={onResendOtp}
          disabled={resendDisabled || isSubmitting}
          className={`font-medium ${
            resendDisabled
              ? "text-gray-500 cursor-not-allowed"
              : "text-indigo-400 hover:text-indigo-300 hover:underline"
          }`}
        >
          resend it
        </button>
      </div>

      <div className="flex items-center justify-center mt-6">
        <div className="flex items-center text-xs text-gray-500">
          <FiLock className="mr-1 text-green-400" />
          <span>End-to-end encrypted verification</span>
        </div>
      </div>
    </div>
  );
};

export default OtpInput;
