import React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define roles
const roles = ["Admin", "Business Owner", "Accountant"];

// Zod schema
const registerSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required."),
    email: z.string().email("Please enter a valid email."),
    companyName: z.string().min(2, "Company name is required."),
    phone: z.string().optional(),
    role: z.enum(["Admin", "Business Owner", "Accountant"], {
      errorMap: () => ({ message: "Please select a role." }),
    }),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(6, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

const Register = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    console.log("Registering:", data);
    await new Promise((r) => setTimeout(r, 1000));
    alert("Registration successful!");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <Controller
            name="fullName"
            control={control}
            render={({ field }) => (
              <div>
                <input
                  {...field}
                  placeholder="Full Name"
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
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
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded hover:bg-indigo-700 transition"
          >
            {isSubmitting ? "Creating account..." : "Register"}
          </button>
        </form>

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
