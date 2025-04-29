// VerifyEmail.jsx
import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../utils/api"; // import your mock function

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await verifyEmail(token);
      if (res.success) {
        setVerified(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      setError(err.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Verify Your Email
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {verified ? (
          <div className="bg-green-100 text-green-700 p-4 rounded text-lg">
            Email verified successfully! Redirecting to login...
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-6">
              Click the button below to verify your email.
            </p>

            <button
              onClick={handleVerify}
              disabled={loading || !token}
              className={`w-full py-2 px-4 font-semibold text-white rounded-md transition-all duration-200 ${
                loading || !token
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
