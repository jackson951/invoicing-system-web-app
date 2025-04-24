import React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema definition
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(4, "Password must be at least 4 characters."),
});

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange", // Validate on each change
  });

  const onSubmit = async (data) => {
    console.log("Logging in with:", data);
    // Simulate login
    await new Promise((r) => setTimeout(r, 1000));
    alert("Login successful!");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Sign in to your account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <Controller
            name="email"
            control={control}
            defaultValue=""
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

          {/* Password Field */}
          <Controller
            name="password"
            control={control}
            defaultValue=""
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <a href="/register" className="text-indigo-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
