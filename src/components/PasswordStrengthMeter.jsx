import React from "react";

const PasswordStrengthMeter = ({ password }) => {
  if (!password) return null;

  // Calculate password strength without zxcvbn
  const calculateStrength = (pwd) => {
    let strength = 0;

    // Length check
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;

    // Contains numbers
    if (/\d/.test(pwd)) strength++;

    // Contains uppercase letters
    if (/[A-Z]/.test(pwd)) strength++;

    // Contains lowercase letters
    if (/[a-z]/.test(pwd)) strength++;

    // Contains special characters
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;

    // Cap at 5
    return Math.min(strength, 4);
  };

  const strength = calculateStrength(password);

  const getStrengthLabel = () => {
    switch (strength) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default:
        return "";
    }
  };

  const getStrengthColor = () => {
    switch (strength) {
      case 0:
        return "bg-red-500";
      case 1:
        return "bg-red-400";
      case 2:
        return "bg-yellow-400";
      case 3:
        return "bg-blue-400";
      case 4:
        return "bg-green-500";
      default:
        return "";
    }
  };

  const getStrengthWidth = () => {
    // Scale width based on strength (0-4)
    return `${(strength + 1) * 25}%`;
  };

  const getFeedback = () => {
    if (password.length < 8) return "Password should be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Add uppercase letters";
    if (!/[a-z]/.test(password)) return "Add lowercase letters";
    if (!/\d/.test(password)) return "Add numbers";
    if (!/[^A-Za-z0-9]/.test(password)) return "Add special characters";
    return "";
  };

  return (
    <div className="mt-2">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${getStrengthColor()}`}
          style={{ width: getStrengthWidth() }}
        ></div>
      </div>
      <div className="flex justify-between mt-1 text-xs">
        <span
          className={`font-medium ${getStrengthColor().replace("bg", "text")}`}
        >
          {getStrengthLabel()}
        </span>
        <span className="text-gray-500">{getFeedback()}</span>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
