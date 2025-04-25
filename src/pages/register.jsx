import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaGoogle, FaFacebook, FaGithub } from "react-icons/fa";

// Define roles
const roles = ["Admin", "Business Owner", "Accountant"];

// Zod schema with custom error messages inside `.string()` and `.enum()`
const registerSchema = z
  .object({
    fullName: z
      .string({ required_error: "Please provide your full name." })
      .min(2, { message: "Full name must be at least 2 characters." }),
    email: z
      .string({ required_error: "Email address is required." })
      .email(
        "The email format you entered is invalid. Please enter a valid email."
      ),
    companyName: z
      .string({ required_error: "Company name is required." })
      .min(2, { message: "Company name must be at least 2 characters." }),
    phone: z.string({ required_error: "Phone number is required." }).optional(),
    role: z.enum(["Admin", "Business Owner", "Accountant"], {
      errorMap: () => ({ message: "Please select a valid role." }),
    }),
    password: z
      .string({ required_error: "Password is required." })
      .min(6, { message: "Password must be at least 6 characters long." }),
    confirmPassword: z
      .string({ required_error: "Please confirm your password." })
      .min(6, {
        message: "Password confirmation must be at least 6 characters long.",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

const Register = () => {
  const [formSuccess, setFormSuccess] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    console.log("Registering:", data);
    await new Promise((r) => setTimeout(r, 1500));
    setFormSuccess(true);
  };

  const handleSocialLogin = (provider) => {
    // Handle social login logic here (e.g., Google, Facebook, etc.)
    console.log(`Logging in with ${provider}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Create Your Account
        </h2>

        {/* Success Toast */}
        {formSuccess && (
          <div className="bg-green-500 text-white p-3 mb-4 rounded-lg text-center">
            Registration successful! You can now log in.
          </div>
        )}

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
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 transition-all ease-in-out transform hover:scale-105"
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
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 transition-all ease-in-out transform hover:scale-105"
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
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 transition-all ease-in-out transform hover:scale-105"
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
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 transition-all ease-in-out transform hover:scale-105"
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
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 transition-all ease-in-out transform hover:scale-105"
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
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 transition-all ease-in-out transform hover:scale-105"
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
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 transition-all ease-in-out transform hover:scale-105"
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
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition-all ease-in-out transform hover:scale-105"
          >
            {isSubmitting ? "Creating account..." : "Register"}
          </button>
        </form>

        {/* Social login options */}
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => handleSocialLogin("Google")}
            className="flex items-center bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-all ease-in-out"
          >
            <FaGoogle className="mr-2" />
            Continue with Google
          </button>
          <button
            onClick={() => handleSocialLogin("Facebook")}
            className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-all ease-in-out"
          >
            <FaFacebook className="mr-2" />
            Continue with Facebook
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
