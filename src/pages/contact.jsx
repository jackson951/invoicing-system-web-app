import React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema for validation
const contactSchema = z.object({
  name: z.string().min(2, "Full name is too short."),
  email: z.string().email("Please enter a valid email."),
  company: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

const Contact = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    console.log("Submitted data:", data);
    await new Promise((res) => setTimeout(res, 1000));
    reset();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">
          Schedule a Demo
        </h2>

        {isSubmitSuccessful && (
          <div className="text-green-600 text-center font-semibold mb-4">
            Thank you! We'll be in touch shortly.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <div className="relative">
                <input
                  {...field}
                  type="text"
                  placeholder=" "
                  className={`peer w-full px-4 pt-5 pb-2 border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } rounded focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                <label className="absolute left-4 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-500">
                  Full Name
                </label>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
            )}
          />

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
                  placeholder=" "
                  className={`peer w-full px-4 pt-5 pb-2 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                <label className="absolute left-4 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-500">
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

          {/* Company */}
          <Controller
            name="company"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <div className="relative">
                <input
                  {...field}
                  type="text"
                  placeholder=" "
                  className="peer w-full px-4 pt-5 pb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <label className="absolute left-4 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-500">
                  Company (Optional)
                </label>
              </div>
            )}
          />

          {/* Message */}
          <Controller
            name="message"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <div className="relative">
                <textarea
                  {...field}
                  placeholder=" "
                  rows={4}
                  className={`peer w-full px-4 pt-5 pb-2 border ${
                    errors.message ? "border-red-500" : "border-gray-300"
                  } rounded focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                <label className="absolute left-4 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-500">
                  Your Message
                </label>
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-2 font-medium rounded hover:bg-indigo-700 transition"
          >
            {isSubmitting ? "Sending..." : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
