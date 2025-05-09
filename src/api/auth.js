// auth.js

export const checkTokenExpiration = () => {
  const token = localStorage.getItem("authToken");
  const expirationTime = localStorage.getItem("tokenExpiration");

  // If the token or expiration time is not available, or the token is expired, return false
  if (!token || !expirationTime || Date.now() > parseInt(expirationTime, 10)) {
    return false; // Token is expired or not present
  }
  return true; // Token is valid
};

export const logoutUser = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("tokenExpiration");
  localStorage.removeItem("user");
  window.location.href = "/login"; // Redirect to login page
};
