// src/pages/forgotPassword.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom"; // To redirect after password reset

function ForgotPassword() {
  const [step, setStep] = useState(1); // 1 = Email + Phone, 2 = OTP, 3 = Reset Password
  const [otpSent, setOtpSent] = useState(false); // Flag to track if OTP was sent
  const [otpVerified, setOtpVerified] = useState(false); // Flag to track OTP verification

  const navigate = useNavigate(); // For navigation after password reset

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();

  // Step 1: Submit email and phone
  const onSubmitEmailPhone = async (data) => {
    console.log("Email and Phone Submitted:", data);
    // Here, you can call an API to verify if email + phone exists in your system
    setOtpSent(true); // Mock OTP sent successfully
    setStep(2); // Move to OTP step
  };

  // Step 2: Submit OTP
  const onSubmitOtp = async (data) => {
    console.log("OTP Submitted:", data);
    // Here, you should verify the OTP with your backend
    if (data.otp === "123456") {
      // Simulating successful OTP verification
      setOtpVerified(true);
      setStep(3); // Move to reset password step
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  // Step 3: Reset password
  const onSubmitPasswordReset = async (data) => {
    console.log("Password Reset:", data);
    // Here, call your API to reset the password
    alert("Your password has been reset successfully!");
    navigate("/login"); // Redirect to login after successful password reset
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Forgot Password
        </h2>

        {step === 1 && (
          <>
            <p className="text-sm text-center text-gray-600">
              Enter your email and phone number, and we’ll send you a link to
              reset your password.
            </p>
            <form
              onSubmit={handleSubmit(onSubmitEmailPhone)}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="you@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="123-456-7890"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Invalid phone number",
                    },
                  })}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                {isSubmitting ? "Sending..." : "Send OTP"}
              </button>
            </form>
          </>
        )}

        {step === 2 && otpSent && !otpVerified && (
          <>
            <p className="text-sm text-center text-gray-600">
              We've sent you an OTP to verify your phone number.
            </p>
            <form onSubmit={handleSubmit(onSubmitOtp)} className="space-y-4">
              <div>
                <label
                  htmlFor="otp"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Enter OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
                    errors.otp ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="123456"
                  {...register("otp", {
                    required: "OTP is required",
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: "Invalid OTP",
                    },
                  })}
                />
                {errors.otp && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.otp.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                {isSubmitting ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          </>
        )}

        {step === 3 && otpVerified && (
          <>
            <p className="text-sm text-center text-gray-600">
              Enter a new password to reset your account.
            </p>
            <form
              onSubmit={handleSubmit(onSubmitPasswordReset)}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="newPassword"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
                    errors.newPassword ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="New password"
                  {...register("newPassword", {
                    required: "New password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Confirm new password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) => {
                      const { newPassword } = getValues();
                      return value === newPassword || "Passwords don't match";
                    },
                  })}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
