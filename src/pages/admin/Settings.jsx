import React, { useState } from "react";
import {
  Cog8ToothIcon,
  EnvelopeIcon,
  BellAlertIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const AdminSettings = () => {
  const [generalSettings, setGeneralSettings] = useState({
    appName: "InvoicePro",
    defaultCurrency: "USD",
    timezone: "UTC",
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "",
    smtpPort: "",
    smtpUsername: "",
    smtpPassword: "",
    senderEmail: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    invoiceCreated: true,
    paymentReceived: true,
    invoiceReminder: false,
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (section, name, value) => {
    switch (section) {
      case "general":
        setGeneralSettings({ ...generalSettings, [name]: value });
        break;
      case "email":
        setEmailSettings({ ...emailSettings, [name]: value });
        break;
      case "notifications":
        setNotificationSettings({ ...notificationSettings, [name]: value });
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("General Settings:", generalSettings);
    console.log("Email Settings:", emailSettings);
    console.log("Notification Settings:", notificationSettings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000); // hide after 3s
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-8">
      <h2 className="text-3xl font-bold text-indigo-700 flex items-center gap-2">
        <Cog8ToothIcon className="h-8 w-8 text-indigo-500" /> Admin Settings
      </h2>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* General Settings */}
        <section>
          <h3 className="text-xl font-semibold text-indigo-600 flex items-center gap-2 mb-4">
            <Cog8ToothIcon className="h-6 w-6" /> General
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              id="appName"
              label="App Name"
              value={generalSettings.appName}
              onChange={(val) => handleChange("general", "appName", val)}
            />
            <SelectField
              id="defaultCurrency"
              label="Default Currency"
              value={generalSettings.defaultCurrency}
              options={["USD", "EUR", "GBP"]}
              onChange={(val) =>
                handleChange("general", "defaultCurrency", val)
              }
            />
            <SelectField
              id="timezone"
              label="Timezone"
              value={generalSettings.timezone}
              options={["UTC", "America/New_York", "Europe/London"]}
              onChange={(val) => handleChange("general", "timezone", val)}
            />
          </div>
        </section>

        {/* Email Settings */}
        <section>
          <h3 className="text-xl font-semibold text-green-600 flex items-center gap-2 mb-4">
            <EnvelopeIcon className="h-6 w-6" /> Email Settings (SMTP)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              id="smtpHost"
              label="SMTP Host"
              value={emailSettings.smtpHost}
              onChange={(val) => handleChange("email", "smtpHost", val)}
            />
            <InputField
              id="smtpPort"
              label="SMTP Port"
              type="number"
              value={emailSettings.smtpPort}
              onChange={(val) => handleChange("email", "smtpPort", val)}
            />
            <InputField
              id="smtpUsername"
              label="SMTP Username"
              value={emailSettings.smtpUsername}
              onChange={(val) => handleChange("email", "smtpUsername", val)}
            />
            <InputField
              id="smtpPassword"
              label="SMTP Password"
              type="password"
              value={emailSettings.smtpPassword}
              onChange={(val) => handleChange("email", "smtpPassword", val)}
            />
            <InputField
              id="senderEmail"
              label="Sender Email"
              type="email"
              value={emailSettings.senderEmail}
              onChange={(val) => handleChange("email", "senderEmail", val)}
            />
          </div>
        </section>

        {/* Notification Settings */}
        <section>
          <h3 className="text-xl font-semibold text-yellow-600 flex items-center gap-2 mb-4">
            <BellAlertIcon className="h-6 w-6" /> Notifications
          </h3>
          <div className="space-y-4">
            <ToggleSwitch
              label="Notify on new invoice created"
              checked={notificationSettings.invoiceCreated}
              onChange={(val) =>
                handleChange("notifications", "invoiceCreated", val)
              }
            />
            <ToggleSwitch
              label="Notify on payment received"
              checked={notificationSettings.paymentReceived}
              onChange={(val) =>
                handleChange("notifications", "paymentReceived", val)
              }
            />
            <ToggleSwitch
              label="Send invoice reminders"
              checked={notificationSettings.invoiceReminder}
              onChange={(val) =>
                handleChange("notifications", "invoiceReminder", val)
              }
            />
          </div>
        </section>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-semibold shadow-md transition"
          >
            Save Changes
          </button>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className="mt-4 flex items-center gap-2 text-green-700 bg-green-100 p-3 rounded-md">
            <CheckCircleIcon className="h-5 w-5" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </form>
    </div>
  );
};

// Reusable Input Component
const InputField = ({ id, label, value, onChange, type = "text" }) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
);

// Reusable Select Component
const SelectField = ({ id, label, value, onChange, options }) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      {options.map((opt) => (
        <option key={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

// Reusable Toggle Switch
const ToggleSwitch = ({ label, checked, onChange }) => (
  <label className="flex items-center cursor-pointer">
    <div className="relative">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div
        className={`w-10 h-5 ${
          checked ? "bg-indigo-600" : "bg-gray-300"
        } rounded-full shadow-inner transition`}
      ></div>
      <div
        className={`absolute w-4 h-4 bg-white rounded-full shadow transform transition ${
          checked ? "translate-x-5" : "translate-x-1"
        } top-0.5`}
      />
    </div>
    <span className="ml-3 text-gray-700">{label}</span>
  </label>
);

export default AdminSettings;
