import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import axios from "axios";

// Components
import OtpInput from "../components/OtpInput";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";

// Icons
import {
  FiEye,
  FiEyeOff,
  FiCheck,
  FiX,
  FiInfo,
  FiLock,
  FiMail,
  FiUser,
  FiBriefcase,
  FiPhone,
  FiLoader,
  FiChevronRight,
  FiShield,
} from "react-icons/fi";

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

// Particle system component
const Particles = ({ count = 30 }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(count)].map((_, i) => {
        const size = Math.random() * 5 + 3;
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
  );
};

// Terms and Conditions Modal Component
const TermsModal = ({ isOpen, onClose }) => {
  const modalRef = useRef();

  // Close modal when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            ref={modalRef}
            className="relative max-w-4xl w-full max-h-[90vh] bg-white text-black dark:bg-gray-800 dark:text-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 dark:border-gray-700"
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 p-6 border-b border-gray-300 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Terms and Conditions</h2>
                <button
                  onClick={onClose}
                  className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold mb-4">
                  Last Updated: {new Date().toLocaleDateString()}
                </h3>

                <section className="mb-8">
                  <h4 className="text-lg font-semibold mb-3">
                    1. Introduction
                  </h4>
                  <p className="mb-4">
                    Welcome to our platform. These terms and conditions outline
                    the rules and regulations for the use of our services.
                  </p>
                  <p>
                    By accessing this platform, we assume you accept these terms
                    and conditions. Do not continue to use our services if you
                    do not agree to all of the terms and conditions stated on
                    this page.
                  </p>
                </section>

                <section className="mb-8">
                  <h4 className="text-lg font-semibold mb-3">
                    2. License to Use
                  </h4>
                  <p className="mb-2">
                    Unless otherwise stated, we own the intellectual property
                    rights for all material on this platform. All intellectual
                    property rights are reserved.
                  </p>
                  <p className="mb-2">
                    You may view and/or print pages for your personal use
                    subject to restrictions set in these terms and conditions.
                  </p>
                  <p>You must not:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Republish material from this platform</li>
                    <li>
                      Sell, rent or sub-license material from this platform
                    </li>
                    <li>
                      Reproduce, duplicate or copy material from this platform
                    </li>
                    <li>
                      Redistribute content from this platform (unless content is
                      specifically made for redistribution)
                    </li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h4 className="text-lg font-semibold mb-3">
                    3. User Responsibilities
                  </h4>
                  <p className="mb-2">
                    As a user of our platform, you agree to:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>
                      Provide accurate and complete information when registering
                    </li>
                    <li>
                      Maintain the confidentiality of your account credentials
                    </li>
                    <li>
                      Notify us immediately of any unauthorized use of your
                      account
                    </li>
                    <li>Use the platform only for lawful purposes</li>
                    <li>
                      Not engage in any activity that disrupts or interferes
                      with our services
                    </li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h4 className="text-lg font-semibold mb-3">
                    4. Privacy Policy
                  </h4>
                  <p className="mb-2">
                    Your privacy is important to us. Our Privacy Policy explains
                    how we collect, use, and protect your personal information.
                  </p>
                  <p>
                    By using our platform, you consent to the collection and use
                    of information in accordance with our Privacy Policy.
                  </p>
                </section>

                <section className="mb-8">
                  <h4 className="text-lg font-semibold mb-3">
                    5. Account Termination
                  </h4>
                  <p className="mb-2">
                    We reserve the right to terminate or suspend your account
                    and access to our services immediately, without prior notice
                    or liability, for any reason whatsoever, including without
                    limitation if you breach these Terms and Conditions.
                  </p>
                  <p>
                    Upon termination, your right to use the platform will
                    immediately cease. If you wish to terminate your account,
                    you may simply discontinue using our services.
                  </p>
                </section>

                <section className="mb-8">
                  <h4 className="text-lg font-semibold mb-3">
                    6. Limitation of Liability
                  </h4>
                  <p className="mb-2">
                    In no event shall we, nor any of our officers, directors and
                    employees, be liable to you for anything arising out of or
                    in any way connected with your use of this platform, whether
                    such liability is under contract, tort or otherwise.
                  </p>
                  <p>
                    We shall not be liable for any indirect, consequential or
                    special liability arising out of or in any way related to
                    your use of this platform.
                  </p>
                </section>

                <section className="mb-8">
                  <h4 className="text-lg font-semibold mb-3">
                    7. Indemnification
                  </h4>
                  <p>
                    You hereby indemnify us from and against any and all
                    liabilities, costs, demands, causes of action, damages and
                    expenses (including reasonable attorney's fees) arising out
                    of or in any way related to your breach of any of the
                    provisions of these Terms.
                  </p>
                </section>

                <section className="mb-8">
                  <h4 className="text-lg font-semibold mb-3">
                    8. Changes to Terms
                  </h4>
                  <p className="mb-2">
                    We reserve the right, at our sole discretion, to modify or
                    replace these Terms at any time. If a revision is material,
                    we will try to provide at least 30 days' notice prior to any
                    new terms taking effect.
                  </p>
                  <p>
                    By continuing to access or use our platform after those
                    revisions become effective, you agree to be bound by the
                    revised terms.
                  </p>
                </section>

                <section className="mb-8">
                  <h4 className="text-lg font-semibold mb-3">
                    9. Governing Law
                  </h4>
                  <p>
                    These Terms shall be governed and construed in accordance
                    with the laws of the jurisdiction in which our company is
                    registered, without regard to its conflict of law
                    provisions.
                  </p>
                </section>

                <section>
                  <h4 className="text-lg font-semibold mb-3">
                    10. Contact Information
                  </h4>
                  <p>
                    If you have any questions about these Terms, please contact
                    us at legal@yourcompany.com.
                  </p>
                </section>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white dark:bg-gray-800 p-4 border-t border-gray-300 dark:border-gray-700 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                I Understand
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

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
  const [hoverState, setHoverState] = useState(null);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef();
  const controls = useAnimation();

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
  const password = watch("password");

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

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError("");

    await controls.start({
      scale: 0.98,
      transition: { duration: 0.2 },
    });

    const registrationData = { ...data, role: "Admin" };

    try {
      const res = await ApiService.post("/auth/register", registrationData);
      console.log("API response:", res.data);

      if (res.status === 200) {
        //sendOtp(res.data.email);
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

      await controls.start({
        x: [0, -10, 10, -10, 0],
        transition: { duration: 0.5 },
      });

      setApiError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
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

        // Success animation
        await controls.start({
          scale: 1,
          transition: { duration: 0.3 },
        });

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 overflow-hidden relative flex items-center justify-center px-4 py-12">
      {/* Terms and Conditions Modal */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />

      {/* Background particles */}
      <Particles count={50} />

      {/* Floating gradient circles */}
      <motion.div
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
        className="absolute -left-32 -top-32 w-96 h-96 rounded-full bg-gradient-to-r from-indigo-600/20 to-purple-600/20 blur-3xl -z-10"
      />
      <motion.div
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
        className="absolute -right-32 -bottom-32 w-96 h-96 rounded-full bg-gradient-to-r from-pink-600/20 to-purple-600/20 blur-3xl -z-10"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl w-full relative"
      >
        {/* Glass card effect */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 -z-10"></div>

        <motion.div
          ref={formRef}
          animate={controls}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-8 rounded-2xl shadow-xl border border-white/10 backdrop-blur-sm"
        >
          {/* Progress Steps */}
          <div className="flex justify-between mb-8 relative">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div
                  className={`flex flex-col items-center ${
                    currentStep >= step ? "text-indigo-400" : "text-gray-500"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      currentStep >= step
                        ? "border-indigo-400 bg-indigo-900/50"
                        : "border-gray-600"
                    } transition-all`}
                  >
                    {currentStep > step ? (
                      <FiCheck className="text-indigo-400" />
                    ) : (
                      <span className="text-lg font-medium">{step}</span>
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
                      currentStep > step ? "bg-indigo-400" : "bg-gray-600"
                    } transition-all`}
                    style={{ left: `${step * 33.33 - 16.66}%` }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400">
                  {showOtpInput
                    ? "Verify Your Identity"
                    : "Create Owner Account"}
                </h2>
                <p className="text-gray-400 mb-6">
                  {showOtpInput
                    ? "Enter the 6-digit code sent to your email"
                    : "Full administrative access to the platform"}
                </p>
              </motion.div>

              {/* Error Toast */}
              <AnimatePresence>
                {apiError && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-red-900/50 border-l-4 border-red-400 p-4 mb-6 rounded-lg"
                  >
                    <div className="flex items-center">
                      <FiX className="text-red-400 mr-2" />
                      <p className="text-red-100">{apiError}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success Toast - Registration */}
              {formSuccess && !showOtpInput && (
                <div className="bg-green-900/50 border-l-4 border-green-400 text-green-100 p-4 mb-6 rounded-lg">
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
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="text-gray-500" />
                      </div>
                      <Controller
                        name="fullName"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            placeholder="John Doe"
                            className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-gray-400 transition-all ${
                              errors.fullName
                                ? "border-red-400"
                                : "border-gray-600"
                            }`}
                          />
                        )}
                      />
                    </div>
                    {errors.fullName && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-1 flex items-center"
                      >
                        <FiInfo className="mr-1" /> {errors.fullName.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="text-gray-500" />
                      </div>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="email"
                            placeholder="john@example.com"
                            className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-gray-400 transition-all ${
                              errors.email
                                ? "border-red-400"
                                : "border-gray-600"
                            }`}
                          />
                        )}
                      />
                    </div>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-1 flex items-center"
                      >
                        <FiInfo className="mr-1" /> {errors.email.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Company Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Company Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiBriefcase className="text-gray-500" />
                      </div>
                      <Controller
                        name="companyName"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            placeholder="Acme Inc"
                            className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-gray-400 transition-all ${
                              errors.companyName
                                ? "border-red-400"
                                : "border-gray-600"
                            }`}
                          />
                        )}
                      />
                    </div>
                    {errors.companyName && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-1 flex items-center"
                      >
                        <FiInfo className="mr-1" /> {errors.companyName.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Phone Number{" "}
                      <span className="text-gray-500">(optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiPhone className="text-gray-500" />
                      </div>
                      <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-gray-400 transition-all ${
                              errors.phone
                                ? "border-red-400"
                                : "border-gray-600"
                            }`}
                          />
                        )}
                      />
                    </div>
                    {errors.phone && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-1 flex items-center"
                      >
                        <FiInfo className="mr-1" /> {errors.phone.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="text-gray-500" />
                      </div>
                      <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className={`w-full pl-10 pr-10 py-3 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-gray-400 transition-all ${
                              errors.password
                                ? "border-red-400"
                                : "border-gray-600"
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
                    {password && <PasswordStrengthMeter password={password} />}
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-1 flex items-center"
                      >
                        <FiInfo className="mr-1" /> {errors.password.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="text-gray-500" />
                      </div>
                      <Controller
                        name="confirmPassword"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className={`w-full pl-10 pr-10 py-3 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-gray-400 transition-all ${
                              errors.confirmPassword
                                ? "border-red-400"
                                : "border-gray-600"
                            }`}
                          />
                        )}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-1 flex items-center"
                      >
                        <FiInfo className="mr-1" />{" "}
                        {errors.confirmPassword.message}
                      </motion.p>
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
                            className="w-4 h-4 text-indigo-600 border-gray-600 rounded focus:ring-indigo-500 bg-gray-700"
                          />
                        )}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="terms"
                        className="font-medium text-gray-300"
                      >
                        I agree to the{" "}
                        <button
                          type="button"
                          onClick={() => setShowTermsModal(true)}
                          className="text-indigo-400 hover:text-indigo-300 hover:underline"
                        >
                          Terms of Service
                        </button>{" "}
                        and{" "}
                        <a
                          href="#"
                          className="text-indigo-400 hover:text-indigo-300 hover:underline"
                        >
                          Privacy Policy
                        </a>
                      </label>
                      {errors.terms && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-sm mt-1 flex items-center"
                        >
                          <FiInfo className="mr-1" /> {errors.terms.message}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !isValid}
                    className={`w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex justify-center items-center relative overflow-hidden ${
                      loading || !isValid ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    onMouseEnter={() => setHoverState("submit")}
                    onMouseLeave={() => setHoverState(null)}
                  >
                    {/* Button hover effect */}
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
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <span>Register as Owner</span>
                        <FiChevronRight className="ml-2" />
                      </>
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
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 flex items-center justify-center">
                      <FiCheck className="text-white text-3xl" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    Email Verification Sent
                  </h3>
                  <p className="text-gray-400 mb-6">
                    A secure verification link has been sent to{" "}
                    <span className="text-indigo-300">{email}</span>. Please
                    check your inbox (and spam/junk folder) to complete your
                    registration.
                  </p>
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
                  >
                    Continue to Login
                  </button>
                </div>
              )}

              {/* Login Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
                  >
                    Sign in
                  </a>
                </p>
              </div>
            </div>

            {/* Right Column - Info/Illustration */}
            <div className="hidden md:block">
              <div className="h-full flex flex-col justify-center items-center bg-gray-700/50 rounded-lg p-8 border border-white/10">
                <div className="text-center max-w-xs">
                  <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                      <FiShield className="text-white text-4xl" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Owner Privileges
                  </h3>
                  <p className="text-gray-400 mb-6">
                    As the owner, you'll have complete control over your
                    organization's account with these exclusive privileges:
                  </p>
                  <div className="space-y-3 text-left">
                    <div className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mr-2 mt-0.5">
                        <FiCheck className="text-green-400 text-xs" />
                      </div>
                      <span className="text-gray-300">
                        Full administrative control
                      </span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mr-2 mt-0.5">
                        <FiCheck className="text-green-400 text-xs" />
                      </div>
                      <span className="text-gray-300">User management</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mr-2 mt-0.5">
                        <FiCheck className="text-green-400 text-xs" />
                      </div>
                      <span className="text-gray-300">
                        System configuration
                      </span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mr-2 mt-0.5">
                        <FiCheck className="text-green-400 text-xs" />
                      </div>
                      <span className="text-gray-300">Advanced analytics</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mr-2 mt-0.5">
                        <FiCheck className="text-green-400 text-xs" />
                      </div>
                      <span className="text-gray-300">
                        Billing and subscriptions
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex items-center justify-center text-xs text-gray-500"
        >
          <div className="flex items-center">
            <FiShield className="w-4 h-4 text-green-400 mr-1" />
            <span>End-to-end encrypted | GDPR compliant</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
