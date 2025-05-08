// src/contexts/ActiveTabContext.jsx
import { createContext, useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";

const ActiveTabContext = createContext();

export const ActiveTabProvider = ({ children }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    // Extract tab from URL when initializing
    const pathParts = location.pathname.split("/");
    if (pathParts[1] === "admin" && pathParts[2]) {
      return pathParts[2];
    }
    return "dashboard"; // default tab
  });

  return (
    <ActiveTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </ActiveTabContext.Provider>
  );
};

export const useActiveTab = () => {
  const context = useContext(ActiveTabContext);
  if (!context) {
    throw new Error("useActiveTab must be used within an ActiveTabProvider");
  }
  return context;
};
