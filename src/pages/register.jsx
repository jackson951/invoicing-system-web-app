// Register.jsx

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

// Import UI components
import OtpInput from "../components/OtpInput";

// Import dummy API methods
import { registerUser, sendOtp, verifyOtp } from "../utils/api";

// Define roles
const roles = ["Admin", "Business Owner", "Accountant"];

// Zod validation schema with custom error messages
const registerSchema = z
  .object({
    fullName: z
      .string({ required_error: "Please provide your full name." })
      .min(2, { message: "Full name must be at least 2 characters." }),
    email: z
      .string({ required_error: "Email address is required." })
      .email("Please enter a valid email."),
    companyName: z
      .string({ required_error: "Company name is required." })
      .min(2, {
        message: "Company name must be at least 2 characters.",
      }),
    phone: z.string().optional(),
    role: z.enum(["Admin", "Business Owner", "Accountant"], {
      errorMap: () => ({ message: "Please select a valid role." }),
    }),
    password: z.string({ required_error: "Password is required." }).min(6, {
      message: "Password must be at least 6 characters long.",
    }),
    confirmPassword: z
      .string({ required_error: "Please confirm your password." })
      .min(6, {
        message: "Password confirmation must be at least 6 characters long.",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const Register = () => {
  const [formSuccess, setFormSuccess] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const email = watch("email");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError("");
    try {
      await registerUser(data);
      await sendOtp(data.email);
      console.log("Registration successful");
      setFormSuccess(true);
      setShowOtpInput(true); // Show OTP after registration
    } catch (error) {
      setApiError(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (otpData) => {
    setLoading(true);
    setApiError("");

    try {
      const result = await verifyOtp(otpData.email, otpData.otp);

      if (result.success && result.token) {
        setOtpSuccess(true);
        navigate(`/verify-email?token=${result.token}`);
      }
    } catch (error) {
      setApiError(error.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Logging in with ${provider}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        {/* Conditional title based on step */}
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {showOtpInput ? "Verify OTP" : "Create Your Account"}
        </h2>

        {/* Error Toast */}
        {apiError && (
          <div className="bg-red-500 text-white p-3 mb-4 rounded-lg text-center">
            {apiError}
          </div>
        )}

        {/* Success Toast - Registration */}
        {formSuccess && !showOtpInput && (
          <div className="bg-green-500 text-white p-3 mb-4 rounded-lg text-center">
            Registration successful! Please verify your OTP.
          </div>
        )}

        {/* Success Toast - OTP Verified */}
        {otpSuccess && (
          <div className="bg-green-500 text-white p-3 mb-4 rounded-lg text-center">
            OTP verified successfully! You can now log in.
          </div>
        )}

        {/* Main Form or OTP Step */}
        {!showOtpInput ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <div>
                  <input
                    {...field}
                    placeholder="Full Name"
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 transition-all ease-in-out hover:scale-105"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Email */}
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <div>
                  <input
                    {...field}
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 transition-all ease-in-out hover:scale-105"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Company Name */}
            <Controller
              name="companyName"
              control={control}
              render={({ field }) => (
                <div>
                  <input
                    {...field}
                    placeholder="Company Name"
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 transition-all ease-in-out hover:scale-105"
                  />
                  {errors.companyName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.companyName.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Phone */}
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <div>
                  <input
                    {...field}
                    type="tel"
                    placeholder="Phone Number (optional)"
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 transition-all ease-in-out hover:scale-105"
                  />
                </div>
              )}
            />

            {/* Role */}
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <div>
                  <select
                    {...field}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 transition-all ease-in-out hover:scale-105"
                  >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  {errors.role && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.role.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Password */}
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <div>
                  <input
                    {...field}
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 transition-all ease-in-out hover:scale-105"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Confirm Password */}
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <div>
                  <input
                    {...field}
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 transition-all ease-in-out hover:scale-105"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition-all ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>
        ) : (
          // When showOtpInput is true, only show OTP component + hide social buttons
          <>
            <OtpInput
              control={control}
              errors={errors}
              onSubmit={handleOtpSubmit}
              isSubmitting={loading}
              email={email}
            />
          </>
        )}

        {/* Hide social login when OTP input is shown */}
        {!showOtpInput && (
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={() => handleSocialLogin("Google")}
              className="flex items-center bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-all ease-in-out"
            >
              <span className="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.4 0 5.373 0 .667 4.707.667 11.693s4.707 11.693 11.693 11.693c6.627 0 11.173-5.267 11.173-9.453 0-.427-.033-.84-.107-1.253H12.48z" />
                </svg>
              </span>
              Continue with Google
            </button>
            <button
              onClick={() => handleSocialLogin("Facebook")}
              className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-all ease-in-out"
            >
              <span className="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
                </svg>
              </span>
              Continue with Facebook
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
