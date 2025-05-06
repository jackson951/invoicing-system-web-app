import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

// Components
import OtpInput from "../components/OtpInput";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";

// Icons
import { FiEye, FiEyeOff, FiCheck, FiX, FiInfo } from "react-icons/fi";

// Services
import {
  registerUser,
  sendOtp,
  verifyOtp,
  sendVerificationEmail,
} from "../utils/api";

import { ApiService } from "../api/web-api-service";

// Zod Validation Schema
const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, { message: "Full name must be at least 2 characters." })
      .max(50, { message: "Full name cannot exceed 50 characters." })
      .regex(/^[a-zA-Z\s'-]+$/, {
        message:
          "Name can only contain letters, spaces, hyphens, and apostrophes.",
      }),
    email: z
      .string()
      .email("Please enter a valid email.")
      .endsWith(".com", { message: "Email must be a .com domain." }),
    companyName: z
      .string()
      .min(2, { message: "Company name must be at least 2 characters." })
      .max(50, { message: "Company name cannot exceed 50 characters." }),
    phone: z
      .string()
      .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, {
        message: "Please enter a valid phone number.",
      })
      .optional(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number." })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character.",
      }),
    confirmPassword: z.string(),
    terms: z.literal(true, {
      errorMap: () => ({
        message: "You must accept the terms and conditions.",
      }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [timer, setTimer] = useState(0);
  const [resendOtpDisabled, setResendOtpDisabled] = useState(false);
  const API_URL = "https://localhost:7221/api/auth/register";

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    trigger,
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: { terms: false },
  });

  const email = watch("email");
  const navigate = useNavigate();

  // OTP Timer
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0 && resendOtpDisabled) {
      setResendOtpDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer, resendOtpDisabled]);

  // Handle Registration
  const onSubmit = async (data) => {
    setLoading(true);
    setApiError("");

    const registrationData = { ...data, role: "Admin" };

    try {
      const res = await ApiService.post("/auth/register", registrationData);
      console.log(res, "resuuuuuuuuuuuuuuuuuuult");

      if (res.status === 200 || res.data === "User registered successfully.") {
        await sendOtp(data.email);
        setShowOtpInput(true);
        setCurrentStep(2);
        setFormSuccess(true);
        setTimer(60);
        setResendOtpDisabled(true);
      } else {
        throw new Error("Unexpected registration response");
      }
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data || error.message
      );
      alert("Registration failed");
      setApiError(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP Submission
  const handleOtpSubmit = async (otpData) => {
    setLoading(true);
    setApiError("");
    try {
      const result = await verifyOtp(otpData.email, otpData.otp);
      if (result.success && result.token) {
        setOtpSuccess(true);

        // Send verification email
        const emailRes = await sendVerificationEmail(otpData.email);
        if (emailRes.success) {
          setCurrentStep(3); // Move to completion step
        } else {
          setApiError("Failed to send verification email.");
        }
      } else {
        setApiError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      setApiError(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    try {
      setResendOtpDisabled(true);
      setTimer(60);
      await sendOtp(email);
    } catch (error) {
      setApiError(error.message || "Failed to resend OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full bg-white p-8 rounded-xl shadow-xl">
        {/* Progress Steps */}
        <div className="flex justify-between mb-8 relative">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div
                className={`flex flex-col items-center ${
                  currentStep >= step ? "text-indigo-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= step
                      ? "border-indigo-600 bg-indigo-100"
                      : "border-gray-300"
                  }`}
                >
                  {currentStep > step ? (
                    <FiCheck className="text-indigo-600" />
                  ) : (
                    step
                  )}
                </div>
                <span className="mt-2 text-sm font-medium">
                  {step === 1
                    ? "Account"
                    : step === 2
                    ? "Verification"
                    : "Complete"}
                </span>
              </div>
              {step < 3 && (
                <div
                  className={`absolute top-1/2 h-1 w-1/3 ${
                    currentStep > step ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                  style={{ left: `${step * 33.33 - 16.66}%` }}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              {showOtpInput ? "Verify Your Email" : "Create Owner Account"}
            </h2>

            {/* Error Toast */}
            <AnimatePresence>
              {apiError && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded"
                >
                  <div className="flex items-center">
                    <FiX className="mr-2" />
                    <p>{apiError}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Toast - Registration */}
            {formSuccess && !showOtpInput && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
                <div className="flex items-center">
                  <FiCheck className="mr-2" />
                  Registration successful! Please verify your OTP.
                </div>
              </div>
            )}

            {/* Form or OTP Step */}
            {!showOtpInput ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <Controller
                    name="fullName"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        placeholder="John Doe"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                          errors.fullName ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    )}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <FiInfo className="mr-1" /> {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="email"
                        placeholder="john@example.com"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    )}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <FiInfo className="mr-1" /> {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <Controller
                    name="companyName"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        placeholder="Acme Inc"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                          errors.companyName
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                    )}
                  />
                  {errors.companyName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <FiInfo className="mr-1" /> {errors.companyName.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number{" "}
                    <span className="text-gray-500">(optional)</span>
                  </label>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                          errors.phone ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    )}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <FiInfo className="mr-1" /> {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Controller
                      name="password"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                            errors.password
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                      )}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {watch("password") && (
                    <PasswordStrengthMeter password={watch("password")} />
                  )}
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <FiInfo className="mr-1" /> {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Controller
                      name="confirmPassword"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                            errors.confirmPassword
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                      )}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <FiInfo className="mr-1" />{" "}
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <Controller
                      name="terms"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          id="terms"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                      )}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="terms"
                      className="font-medium text-gray-700"
                    >
                      I agree to the{" "}
                      <a
                        href="#"
                        className="text-indigo-600 hover:text-indigo-500"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="text-indigo-600 hover:text-indigo-500"
                      >
                        Privacy Policy
                      </a>
                    </label>
                    {errors.terms && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <FiInfo className="mr-1" /> {errors.terms.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !isValid}
                  className={`w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all flex justify-center items-center ${
                    loading || !isValid ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
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
                      Creating Account...
                    </>
                  ) : (
                    "Register as Owner"
                  )}
                </button>
              </form>
            ) : currentStep === 2 ? (
              <OtpInput
                control={control}
                errors={errors}
                onSubmit={handleOtpSubmit}
                isSubmitting={loading}
                email={email}
                onResendOtp={handleResendOtp}
                resendDisabled={resendOtpDisabled}
                timer={timer}
              />
            ) : (
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <FiCheck className="text-green-500 text-5xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Email Sent</h3>
                <p className="text-gray-600">
                  A verification link has been sent to your email address.
                  Please check your inbox (and spam/junk folder) and click the
                  link to complete your registration.
                </p>
                <button
                  onClick={() => navigate("/login")}
                  className="mt-6 w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all"
                >
                  Go to Login
                </button>
              </div>
            )}

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>

          {/* Right Column - Info/Illustration */}
          <div className="hidden md:block">
            <div className="h-full flex flex-col justify-center items-center bg-indigo-50 rounded-lg p-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Owner Account
                </h3>
                <p className="text-gray-600 mb-6">
                  As the owner, you'll have full access to manage users,
                  settings, and all aspects of the application.
                </p>
                <div className="space-y-3 text-left">
                  <div className="flex items-start">
                    <FiCheck className="text-green-500 mt-1 mr-2" />
                    <span>Full administrative privileges</span>
                  </div>
                  <div className="flex items-start">
                    <FiCheck className="text-green-500 mt-1 mr-2" />
                    <span>Add and manage other users</span>
                  </div>
                  <div className="flex items-start">
                    <FiCheck className="text-green-500 mt-1 mr-2" />
                    <span>Configure system settings</span>
                  </div>
                  <div className="flex items-start">
                    <FiCheck className="text-green-500 mt-1 mr-2" />
                    <span>Access all features and data</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
