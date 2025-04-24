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
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    console.log("Logging in with:", data);
    await new Promise((r) => setTimeout(r, 1000));
    alert("Login successful!");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <div className="relative">
                <input
                  {...field}
                  type="email"
                  id="email"
                  placeholder=" "
                  className={`peer w-full px-4 pt-5 pb-2 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                <label
                  htmlFor="email"
                  className="absolute left-4 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-500"
                >
                  Email Address
                </label>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Password */}
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <div className="relative">
                <input
                  {...field}
                  type="password"
                  id="password"
                  placeholder=" "
                  className={`peer w-full px-4 pt-5 pb-2 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                <label
                  htmlFor="password"
                  className="absolute left-4 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-500"
                >
                  Password
                </label>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white font-medium py-2 rounded hover:bg-indigo-700 transition"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer Links */}
        <div className="text-sm text-center text-gray-600 mt-6">
          <a
            href="/forgot-password"
            className="text-indigo-600 hover:underline"
          >
            Forgot your password?
          </a>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-indigo-600 hover:underline font-medium"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
