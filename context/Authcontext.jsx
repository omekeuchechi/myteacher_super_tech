import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const EXPIRY_MINUTES = 60 * 24 * 30; // 30 days

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const expiry = localStorage.getItem("user_expiry");
    if (storedUser && expiry && new Date().getTime() < Number(expiry)) {
      setUser(storedUser);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("user_expiry");
      setUser(null);
    }
    setAuthLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem(
      "user_expiry",
      (new Date().getTime() + EXPIRY_MINUTES * 60 * 1000).toString()
    );
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("user_expiry");
  };

  // Update user in state and localStorage
  const updateUser = (newUser) => {
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem(
      "user_expiry",
      (new Date().getTime() + EXPIRY_MINUTES * 60 * 1000).toString()
    );
  };

  return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};