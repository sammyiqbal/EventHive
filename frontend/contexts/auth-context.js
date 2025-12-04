"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token in localStorage or sessionStorage
    const token = localStorage.getItem("eventhive_token") || sessionStorage.getItem("eventhive_token");
    const userData = localStorage.getItem("eventhive_user") || sessionStorage.getItem("eventhive_user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
        // Clear invalid data
        localStorage.removeItem("eventhive_token");
        localStorage.removeItem("eventhive_user");
        sessionStorage.removeItem("eventhive_token");
        sessionStorage.removeItem("eventhive_user");
      }
    }
    setLoading(false);
  }, []);

  const login = (token, userData, rememberMe = false) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("eventhive_token", token);
    storage.setItem("eventhive_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("eventhive_token");
    localStorage.removeItem("eventhive_user");
    sessionStorage.removeItem("eventhive_token");
    sessionStorage.removeItem("eventhive_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}



