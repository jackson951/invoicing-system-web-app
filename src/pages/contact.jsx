import React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";

// Schema for validation
const contactSchema = z.object({
  name: z.string().min(2, "Full name is too short."),
  email: z.string().email("Please enter a valid email."),
  company: z.string().optional(),
  enquiryType: z.string().min(1, "Please select an enquiry type"),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

const enquiryTypes = [
  "General Inquiry",
  "Pricing & Plans",
  "Technical Support",
  "Feature Request",
  "Sales Demo",
];

const Contact = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      enquiryType: "",
      message: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    console.log("Submitted data:", data);
    // Simulate API call
    await new Promise((res) => setTimeout(res, 1500));
    reset(); // This resets the form to default values
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => {
          const size = Math.random() * 5 + 2;
          const duration = Math.random() * 10 + 10;
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

      {/* Main Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full relative"
      >
        <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 -z-10"></div>
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-8 rounded-2xl shadow-xl border border-white/10 backdrop-blur-sm relative z-10">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400 mb-2 text-center">
            QuantumInvoicer
          </h2>
          <p className="text-gray-300 text-center mb-6">Get in touch with us</p>

          <AnimatePresence>
            {isSubmitSuccessful && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-green-900/50 border-l-4 border-green-400 p-4 mb-6 rounded-lg text-center"
              >
                <div className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-green-100">
                    Thank you! We'll reach out shortly.
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <input
                    {...field}
                    type="text"
                    placeholder=" "
                    className={`peer w-full px-4 pt-5 pb-2 bg-gray-800/50 border ${
                      errors.name ? "border-red-500" : "border-gray-600"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-transparent`}
                  />
                  <label className="absolute left-4 top-3 text-sm text-gray-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-indigo-400">
                    Full Name
                  </label>
                  {errors.name && (
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
                      {errors.name.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Email Field */}
            <Controller
              name="email"
              control={control}
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

            {/* Company Field */}
            <Controller
              name="company"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <input
                    {...field}
                    type="text"
                    placeholder=" "
                    className="peer w-full px-4 pt-5 pb-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-transparent"
                  />
                  <label className="absolute left-4 top-3 text-sm text-gray-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-indigo-400">
                    Company (Optional)
                  </label>
                </div>
              )}
            />

            {/* Enquiry Type Field */}
            <Controller
              name="enquiryType"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <select
                    {...field}
                    className={`peer w-full px-4 pt-5 pb-2 bg-gray-800/50 border ${
                      errors.enquiryType ? "border-red-500" : "border-gray-600"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-transparent appearance-none`}
                  >
                    <option value="" disabled></option>
                    {enquiryTypes.map((type, index) => (
                      <option key={index} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <label className="absolute left-4 top-3 text-sm text-gray-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-indigo-400">
                    Enquiry Type
                  </label>
                  {errors.enquiryType && (
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
                      {errors.enquiryType.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Message Field */}
            <Controller
              name="message"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <textarea
                    {...field}
                    placeholder=" "
                    rows={4}
                    className={`peer w-full px-4 pt-5 pb-2 bg-gray-800/50 border ${
                      errors.message ? "border-red-500" : "border-gray-600"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-transparent`}
                  />
                  <label className="absolute left-4 top-3 text-sm text-gray-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-indigo-400">
                    Your Message
                  </label>
                  {errors.message && (
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
                      {errors.message.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Submit Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibound rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex justify-center items-center relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
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
                  Sending...
                </>
              ) : (
                "Send Request"
              )}
            </motion.button>
          </form>
        </div>

        {/* Security Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex items-center justify-center text-xs text-gray-500"
        >
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
          <span>Secure Messaging</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Contact;
