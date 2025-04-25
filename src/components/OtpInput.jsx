// src/components/OtpInput.jsx
import React from "react";
import { Controller } from "react-hook-form";

function OtpInput({ control, errors, onSubmit, isSubmitting }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="otp"
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          Enter OTP
        </label>
        <Controller
          name="otp"
          control={control}
          defaultValue=""
          rules={{
            required: "OTP is required",
            pattern: {
              value: /^[0-9]{6}$/,
              message: "Invalid OTP",
            },
          }}
          render={({ field }) => (
            <input
              id="otp"
              type="text"
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
                errors.otp ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="123456"
              {...field}
            />
          )}
        />
        {errors.otp && (
          <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>
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
  );
}

export default OtpInput;
