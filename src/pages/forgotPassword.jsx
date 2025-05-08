import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import OtpInput from "../components/OtpInput"; // Assuming this is already created
import { motion, AnimatePresence } from "framer-motion";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email/Phone, 2: OTP, 3: Reset Password
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();

  // Step 1: Submit email + phone
  const onSubmitEmailPhone = async (data) => {
    console.log("Email and Phone Submitted:", data);
    await new Promise((res) => setTimeout(res, 1000));
    setOtpSent(true);
    setStep(2);
  };

  // Step 2: Verify OTP
  const onSubmitOtp = async (data) => {
    console.log("OTP Submitted:", data);
    if (data.otp === "123456") {
      await new Promise((res) => setTimeout(res, 800));
      setOtpVerified(true);
      setStep(3);
    } else {
      alert("Invalid OTP");
    }
  };

  // Step 3: Reset password
  const onSubmitPasswordReset = async (data) => {
    console.log("New Password:", data);
    await new Promise((res) => setTimeout(res, 1000));
    alert("Your password has been reset successfully!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => {
          const size = Math.random() * 5 + 2;
          const duration = Math.random() * 15 + 10;
          const delay = Math.random() * 5;
          const x = Math.random() * 100;
          const y = Math.random() * 100;

          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${x}%`,
                top: `${y}%`,
              }}
              animate={{
                x: [0, 50, 0],
                y: [0, 50, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                repeatType: "reverse",
                delay: delay,
              }}
            />
          );
        })}
      </div>

      {/* Floating Gradient Circles */}
      <motion.div
        className="absolute -left-32 -top-32 w-96 h-96 rounded-full bg-gradient-to-r from-indigo-600/20 to-purple-600/20 blur-3xl -z-10"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute -right-32 -bottom-32 w-96 h-96 rounded-full bg-gradient-to-r from-pink-600/20 to-purple-600/20 blur-3xl -z-10"
        animate={{
          backgroundPosition: ["100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
          delay: 5,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full relative"
      >
        <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 -z-10"></div>
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-8 rounded-2xl shadow-xl border border-white/10 backdrop-blur-sm relative z-10">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400 mb-6 text-center">
            Forgot Password
          </h2>

          <p className="text-center text-gray-400 mb-8">
            Enter your details to recover your account.
          </p>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleSubmit(onSubmitEmailPhone)}
                className="space-y-6"
              >
                {/* Email Field */}
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  }}
                  render={({ field }) => (
                    <div className="relative">
                      <input
                        {...field}
                        type="email"
                        placeholder=" "
                        className={`peer w-full px-4 pt-5 pb-2 bg-gray-800/50 border ${
                          errors.email ? "border-red-500" : "border-gray-600"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-transparent`}
                      />
                      <label className="absolute left-4 top-3 text-sm text-gray-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-indigo-400">
                        Email Address
                      </label>
                      {errors.email && (
                        <p className="text-red-400 text-xs mt-1 flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                {/* Phone Field */}
                <Controller
                  name="phone"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Must be 10 digits",
                    },
                  }}
                  render={({ field }) => (
                    <div className="relative">
                      <input
                        {...field}
                        type="tel"
                        placeholder=" "
                        className={`peer w-full px-4 pt-5 pb-2 bg-gray-800/50 border ${
                          errors.phone ? "border-red-500" : "border-gray-600"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-transparent`}
                      />
                      <label className="absolute left-4 top-3 text-sm text-gray-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-indigo-400">
                        Phone Number
                      </label>
                      {errors.phone && (
                        <p className="text-red-400 text-xs mt-1 flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex justify-center items-center relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
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
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </motion.form>
            )}

            {step === 2 && otpSent && !otpVerified && (
              <motion.form
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleSubmit(onSubmitOtp)}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-xl font-medium text-gray-200">
                    Enter OTP
                  </h3>
                  <p className="text-gray-400 mt-2">
                    We have sent an OTP to your phone
                  </p>
                </div>

                <Controller
                  name="otp"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Please enter the OTP",
                    minLength: {
                      value: 6,
                      message: "OTP must be 6 digits",
                    },
                  }}
                  render={({ field }) => (
                    <OtpInput
                      length={6}
                      onChange={(value) => field.onChange(value)}
                      value={field.value || ""}
                      error={errors.otp?.message}
                    />
                  )}
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex justify-center items-center relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
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
                    "Verify OTP"
                  )}
                </button>
              </motion.form>
            )}

            {step === 3 && otpVerified && (
              <motion.form
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleSubmit(onSubmitPasswordReset)}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-xl font-medium text-gray-200">
                    Reset Your Password
                  </h3>
                  <p className="text-gray-400 mt-2">
                    Choose a new password for your account
                  </p>
                </div>

                {/* New Password */}
                <Controller
                  name="newPassword"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "New password is required",
                    minLength: {
                      value: 6,
                      message: "Minimum 6 characters",
                    },
                  }}
                  render={({ field }) => (
                    <div className="relative">
                      <input
                        {...field}
                        type="password"
                        placeholder=" "
                        className={`peer w-full px-4 pt-5 pb-2 bg-gray-800/50 border ${
                          errors.newPassword
                            ? "border-red-500"
                            : "border-gray-600"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-transparent`}
                      />
                      <label className="absolute left-4 top-3 text-sm text-gray-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-indigo-400">
                        New Password
                      </label>
                      {errors.newPassword && (
                        <p className="text-red-400 text-xs mt-1 flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                          {errors.newPassword.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                {/* Confirm Password */}
                <Controller
                  name="confirmPassword"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Please confirm your password",
                    validate: (value) => {
                      const { newPassword } = getValues();
                      return value === newPassword || "Passwords don't match";
                    },
                  }}
                  render={({ field }) => (
                    <div className="relative">
                      <input
                        {...field}
                        type="password"
                        placeholder=" "
                        className={`peer w-full px-4 pt-5 pb-2 bg-gray-800/50 border ${
                          errors.confirmPassword
                            ? "border-red-500"
                            : "border-gray-600"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-transparent`}
                      />
                      <label className="absolute left-4 top-3 text-sm text-gray-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-indigo-400">
                        Confirm Password
                      </label>
                      {errors.confirmPassword && (
                        <p className="text-red-400 text-xs mt-1 flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex justify-center items-center relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
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
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Back to Login */}
          <div className="mt-6 text-center text-xs text-gray-500">
            <button
              onClick={() => navigate("/login")}
              className="text-indigo-400 hover:text-indigo-300 underline"
            >
              Back to Login
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
