import React, { useState, useEffect, useRef, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiCheckCircle,
  FiLock,
  FiMail,
  FiLoader,
  FiChevronRight,
  FiUsers,
  FiBriefcase,
  FiFingerprint,
  FiKey,
} from "react-icons/fi";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../contexts/AuthContext";
import { ApiService } from "../api/web-api-service";

// Particle system component with quantum effects
const QuantumParticles = ({ count = 50 }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(count)].map((_, i) => {
        const size = Math.random() * 6 + 2;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const color = `hsl(${Math.random() * 60 + 200}, 80%, 60%)`;

        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${x}%`,
              top: `${y}%`,
              backgroundColor: color,
              opacity: 0.2,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              repeatType: "reverse",
              delay: delay,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
};

// Schema definition with employee validation
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(4, "Password must be at least 4 characters."),
  employeeId: z.string().optional(),
  department: z.string().optional(),
});

// Department options for employee login
const departments = [
  "Quantum Research",
  "AI Development",
  "Cyber Security",
  "Data Analytics",
  "Engineering",
  "Administration",
];

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [hoverState, setHoverState] = useState(null);
  const [isEmployeeLogin, setIsEmployeeLogin] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser, saveToken } = useAuth();
  const formRef = useRef();
  const controls = useAnimation();

  // Check for redirected message
  const redirectMessage = location.state?.message;

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      employeeId: "",
      department: "",
    },
  });

  const emailValue = watch("email");
  const passwordValue = watch("password");
  const employeeIdValue = watch("employeeId");

  useEffect(() => {
    // Check for biometric authentication capability
    if (navigator.credentials && navigator.credentials.get) {
      setBiometricAvailable(true);
    }

    if (redirectMessage) {
      setApiError(redirectMessage);
      window.history.replaceState({}, document.title);
    }
  }, [redirectMessage]);

  // Toggle between employee and regular login
  const toggleLoginMode = useCallback(() => {
    setIsEmployeeLogin((prev) => !prev);
    setValue("employeeId", "");
    setValue("department", "");
    setSelectedDepartment("");
  }, [setValue]);

  // Handle department selection
  const handleDepartmentSelect = useCallback(
    (dept) => {
      setSelectedDepartment(dept);
      setValue("department", dept);
    },
    [setValue]
  );
  const loginUser = async (credentials) => {
    try {
      const endpoint = isEmployeeLogin ? "/auth/employee-login" : "/auth/login";
      const res = await ApiService.post(endpoint, credentials);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError("");

    // Form submission animation
    await controls.start({
      scale: 0.98,
      transition: { duration: 0.2 },
    });

    try {
      const response = await loginUser(data);
      const decodedToken = decodeJwt(response.token);
      console.log(decodedToken, "the token decoded");
      const expirationTime = decodedToken.exp * 1000; // Convert from seconds to milliseconds
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("tokenExpiration", expirationTime); // Store expiration time

      setUser(response.user);
      saveToken(response.token);
      setLoginSuccess(true);

      // Success animation
      await controls.start({
        scale: 1,
        transition: { duration: 0.3 },
      });

      setTimeout(() => {
        navigate(isEmployeeLogin ? "/employee-dashboard" : "/admin", {
          replace: true,
        });
      }, 1500);
    } catch (error) {
      console.error("Login failed:", error.message);
      await controls.start({
        x: [0, -10, 10, -10, 0],
        transition: { duration: 0.5 },
      });

      const serverMessage =
        error.response?.data?.message ||
        (typeof error.response?.data === "string"
          ? error.response.data
          : null) ||
        "Login failed. Please check your credentials.";

      setApiError(serverMessage);
      reset({
        email: control._formValues.email,
        password: "",
        ...(isEmployeeLogin && { employeeId: control._formValues.employeeId }),
      });
    } finally {
      setLoading(false);
    }
  };
  // decode jwt function
  const decodeJwt = (token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  };

  // Biometric authentication handler
  const handleBiometricAuth = useCallback(async () => {
    try {
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array([user.id]),
          allowCredentials: [
            {
              type: "public-key",
              id: new Uint8Array([
                /* credential ID */
              ]),
            },
          ],
        },
      });
      // Handle successful biometric authentication
      console.log("Biometric authentication successful:", credential);
      // You would typically verify the credential with your backend here
    } catch (err) {
      console.error("Biometric authentication failed:", err);
      setApiError("Biometric authentication failed or was cancelled.");
    }
  }, []);

  // Google login handler
  const loginWithGoogle = useGoogleLogin({
    flow: "implicit",
    onSuccess: (tokenResponse) => {
      handleGoogleLoginSuccess(tokenResponse.id_token);
    },
    onError: () => {
      setApiError("Google login was cancelled or failed.");
    },
  });

  const handleGoogleLoginSuccess = async (idToken) => {
    try {
      const res = await ApiService.post("/auth/google-login", { idToken });
      const { token, user } = res.data;

      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      saveToken(token);
      setUser(user);
      setLoginSuccess(true);

      setTimeout(() => {
        navigate(isEmployeeLogin ? "/employee-dashboard" : "/admin");
      }, 1500);
    } catch (err) {
      console.error("Google login failed:", err);
      setApiError(err.response?.data?.message || "Google login failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 overflow-hidden relative flex items-center justify-center px-4 py-12">
      {/* Quantum particles background */}
      <QuantumParticles count={50} />

      {/* Floating gradient portals */}
      <motion.div
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
        className="absolute -left-32 -top-32 w-96 h-96 rounded-full bg-gradient-to-r from-indigo-600/20 to-purple-600/20 blur-3xl -z-10"
      />
      <motion.div
        animate={{
          backgroundPosition: ["100% 100%", "0% 0%"],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
          delay: 10,
        }}
        className="absolute -right-32 -bottom-32 w-96 h-96 rounded-full bg-gradient-to-r from-pink-600/20 to-purple-600/20 blur-3xl -z-10"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full relative"
      >
        {/* Quantum portal effect */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 -z-10"></div>

        <motion.div
          ref={formRef}
          animate={controls}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-8 rounded-2xl shadow-xl border border-white/10 backdrop-blur-sm"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400 mb-2">
                Quantum Access
              </h1>
              <p className="text-gray-400">
                {isEmployeeLogin
                  ? "Employee Secure Portal"
                  : "Secure Authentication Portal"}
              </p>

              {/* Employee badge */}
              {isEmployeeLogin && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-900/50 text-indigo-300 text-xs font-medium mt-2 border border-indigo-700/50"
                >
                  <FiBriefcase className="mr-1" /> Employee Mode
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Error/Success Toasts */}
          <AnimatePresence>
            {apiError && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-900/50 border-l-4 border-red-400 p-4 mb-6 rounded-lg"
              >
                <div className="flex items-center">
                  <FiAlertCircle className="text-red-400 mr-2" />
                  <p className="text-red-100">{apiError}</p>
                </div>
              </motion.div>
            )}
            {loginSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-green-900/50 border-l-4 border-green-400 p-4 mb-6 rounded-lg"
              >
                <div className="flex items-center">
                  <FiCheckCircle className="text-green-400 mr-2" />
                  <p className="text-green-100">
                    {isEmployeeLogin
                      ? "Employee authentication successful"
                      : "Authentication successful"}
                    . Redirecting...
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Mode Toggle */}
          <div className="flex justify-center mb-6">
            <button
              onClick={toggleLoginMode}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isEmployeeLogin
                  ? "bg-indigo-900/30 text-indigo-300 border border-indigo-700/50"
                  : "bg-gray-700/50 text-gray-300 border border-gray-600/50"
              }`}
            >
              <span className="flex items-center">
                {isEmployeeLogin ? (
                  <>
                    <FiUsers className="mr-2" /> Switch to Admin Login
                  </>
                ) : (
                  <>
                    <FiBriefcase className="mr-2" /> Switch to Employee Login
                  </>
                )}
              </span>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                {isEmployeeLogin ? "Corporate Email" : "Email Address"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-500" />
                </div>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <input
                      {...field}
                      type="email"
                      id="email"
                      placeholder={
                        isEmployeeLogin ? "name@company.com" : "you@example.com"
                      }
                      autoComplete="username"
                      className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-gray-400 transition-all ${
                        errors.email ? "border-red-400" : "border-gray-600"
                      }`}
                    />
                  )}
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs mt-1 flex items-center"
                >
                  <FiAlertCircle className="mr-1" /> {errors.email.message}
                </motion.p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-500" />
                </div>
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className={`w-full pl-10 pr-10 py-3 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-gray-400 transition-all ${
                        errors.password ? "border-red-400" : "border-gray-600"
                      }`}
                    />
                  )}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs mt-1 flex items-center"
                >
                  <FiAlertCircle className="mr-1" /> {errors.password.message}
                </motion.p>
              )}
            </div>

            {/* Employee ID Field (Conditional) */}
            {isEmployeeLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mb-4">
                  <label
                    htmlFor="employeeId"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Employee ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiKey className="text-gray-500" />
                    </div>
                    <Controller
                      name="employeeId"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          id="employeeId"
                          placeholder="QNT-XXXX-XXXX"
                          className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-gray-400 transition-all ${
                            errors.employeeId
                              ? "border-red-400"
                              : "border-gray-600"
                          }`}
                        />
                      )}
                    />
                  </div>
                  {errors.employeeId && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-xs mt-1 flex items-center"
                    >
                      <FiAlertCircle className="mr-1" />{" "}
                      {errors.employeeId.message}
                    </motion.p>
                  )}
                </div>

                {/* Department Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Department
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {departments.map((dept) => (
                      <motion.button
                        key={dept}
                        type="button"
                        onClick={() => handleDepartmentSelect(dept)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`px-3 py-2 text-xs rounded-md transition-all ${
                          selectedDepartment === dept
                            ? "bg-indigo-600/50 text-indigo-100 border border-indigo-400/50"
                            : "bg-gray-700/50 text-gray-300 border border-gray-600/50 hover:bg-gray-700/70"
                        }`}
                      >
                        {dept}
                      </motion.button>
                    ))}
                  </div>
                  <input type="hidden" {...control.register("department")} />
                </div>
              </motion.div>
            )}

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 bg-gray-700 border-gray-600 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-300"
              >
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isValid}
              className={`w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex justify-center items-center relative overflow-hidden ${
                loading || !isValid ? "opacity-80 cursor-not-allowed" : ""
              }`}
              onMouseEnter={() => setHoverState("submit")}
              onMouseLeave={() => setHoverState(null)}
            >
              {hoverState === "submit" && (
                <motion.span
                  className="absolute inset-0 bg-white/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}

              {loading ? (
                <>
                  <FiLoader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  {isEmployeeLogin
                    ? "Verifying Employee Credentials..."
                    : "Authenticating..."}
                </>
              ) : (
                <>
                  <span>
                    {isEmployeeLogin ? "Access Employee Portal" : "Continue"}
                  </span>
                  <FiChevronRight className="ml-2" />
                </>
              )}
            </button>

            {/* Biometric Authentication */}
            {biometricAvailable && isEmployeeLogin && (
              <motion.button
                type="button"
                onClick={handleBiometricAuth}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 bg-gray-700/50 text-indigo-300 font-medium rounded-lg border border-indigo-600/50 hover:bg-gray-700/70 transition-all flex items-center justify-center mt-4"
              >
                <FiKey className="mr-2" />
                Use Biometric Authentication
              </motion.button>
            )}
          </form>

          {/* Social Login */}
          {!isEmployeeLogin && (
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600/50"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-800/80 text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <motion.button
                  onClick={loginWithGoogle}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-600/50 rounded-lg shadow-sm bg-gray-700/50 text-sm font-medium text-white hover:bg-gray-700/70 transition-all relative overflow-hidden"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => console.log("GitHub login")}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-600/50 rounded-lg shadow-sm bg-gray-700/50 text-sm font-medium text-white hover:bg-gray-700/70 transition-all relative overflow-hidden"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678 92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  GitHub
                </motion.button>
              </div>
            </div>
          )}

          {/* Register Link */}
          {!isEmployeeLogin && (
            <div className="mt-8 text-center text-sm text-gray-400">
              <p>
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
                >
                  Register here
                </Link>
              </p>
            </div>
          )}

          {/* Security badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 flex items-center justify-center text-xs text-gray-500"
          >
            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-green-400 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span>Quantum-grade end-to-end encryption</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
