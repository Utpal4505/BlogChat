// src/context/AuthContext.jsx
import { createContext, useEffect, useState } from "react";
import axios from "axios";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

// ✅ axios instance with credentials for cookies
const api = axios.create({
  baseURL: "http://localhost:8000/api/v1/users", // change if different
  withCredentials: true, // important for cookies
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Get current user from backend (/me)
  const fetchUser = async () => {
    try {
      const { data } = await api.get("/me");
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // ✅ Register
  const register = async ({ name, email, username, password }) => {
    try {
      const { data } = await api.post("/register", {
        name,
        email,
        username,
        password,
      });
      setUser(data.user);
      return data;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  // ✅ Login with username + password
  const login = async ({ username, password }) => {
    try {
      const { data } = await api.post("/login", { username, password });
      setUser(data.user);
      return data;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  // ✅ Login with Google
  const loginWithGoogle = () => {
    window.location.href = "http://localhost:8000/api/v1/auth/google";
  };

  // ✅ Logout
  const logout = async () => {
    try {
      await api.post("/logout");
      setUser(null);
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, loginWithGoogle, register, logout, fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Remove useAuth hook from this file
