import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useIdleLogout = (timeout = 3600000) => {
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("authToken");
    toast.info("Session expired due to inactivity.", {
      position: "top-right",
      autoClose: 3000,
    });
    navigate("/login");
  };

  const resetTimer = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(logout, timeout);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "scroll", "click"];

    for (let event of events) {
      window.addEventListener(event, resetTimer);
    }

    resetTimer(); // Start the timer

    return () => {
      for (let event of events) {
        window.removeEventListener(event, resetTimer);
      }
      clearTimeout(timerRef.current);
    };
  }, []);
};

export default useIdleLogout;
