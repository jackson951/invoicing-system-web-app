import React, { createContext, useState, useEffect, useContext } from "react";

// Create the AuthContext
const AuthContext = createContext();

// AuthContextProvider component
const AuthContextProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() => {
    return localStorage.getItem("authToken") || null;
  });

  const [user, setUser] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const saveToken = (token) => {
    try {
      localStorage.setItem("authToken", token);
      setAuthToken(token);
    } catch (error) {
      console.error("Failed to save token to localStorage", error);
    }
  };

  const saveRefreshToken = (refreshToken) => {
    try {
      localStorage.setItem("refreshToken", refreshToken);
    } catch (error) {
      console.error("Failed to save refreshToken to localStorage", error);
    }
  };

  const removeRefreshToken = () => {
    try {
      localStorage.removeItem("refreshToken");
    } catch (error) {
      console.error("Failed to remove refreshToken", error);
    }
  };

  const removeToken = () => {
    try {
      localStorage.removeItem("authToken");
      setAuthToken(null);
    } catch (error) {
      console.error("Failed to remove authToken", error);
    }
  };

  const getToken = () => {
    const token = authToken;
    return token || localStorage.getItem("authToken");
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) setAuthToken(token);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authToken,
        setAuthToken,
        saveToken,
        removeToken,
        saveRefreshToken,
        removeRefreshToken,
        getToken,
        setUser,
        user,
        isLoggedIn,
        setIsLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook for easy access
const useAuth = () => useContext(AuthContext);

export { AuthContextProvider, useAuth };
