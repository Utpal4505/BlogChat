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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Agar backend se response aaya hai
    if (error.response) {
      const { message, errors } = error.response.data;

      return Promise.reject({
        message: message || "Something went wrong",
        errors: errors || [],
      });
    }

    // Agar network error / server down ho
    return Promise.reject({
      message: "Network error. Please try again later.",
      errors: [],
    });
  }
);

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

  const verifyOTP = async ({verificationId, otp}) => {
    try {
      const { data } = await api.post("/verifyOTP", { verificationId , otp });
      setUser(data.user);
      return data;
    } catch (err) {
      throw err.response?.data || err.message;
    }
  };

  //onboard user
  const onBoardUser = async ({ username, password, bio, email }) => {
    try {
      const { data } = await api.post("/onboarding", {
        username,
        password,
        bio,
        email,
      });
      setUser(data.user);
      return data;
    } catch (err) {
      throw err.response?.data || err.message;
    }
  };

  //check-username availability
  const checkUsernameAvailability = async (username) => {
    try {
      const { data } = await api.post("/username-check", { username });
      return data;
    } catch (err) {
      throw err.response?.data || err.message;
    }
  };

  // ✅ Register
  const register = async ({ name, email }) => {
    try {
      const { data } = await api.post("/register", {
        name,
        email,
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
      value={{
        user,
        loading,
        login,
        loginWithGoogle,
        register,
        logout,
        fetchUser,
        checkUsernameAvailability,
        onBoardUser,
        verifyOTP,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Remove useAuth hook from this file
