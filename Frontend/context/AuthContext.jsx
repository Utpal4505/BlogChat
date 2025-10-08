// src/context/AuthContext.jsx
import { createContext, useEffect, useState } from "react";
import axios from "axios";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

// ✅ axios instance with credentials for cookies
const Userapi = axios.create({
  baseURL: "http://localhost:8000/api/v1/users",
  withCredentials: true,
});

const Postapi = axios.create({
  baseURL: "http://localhost:8000/api/v1/posts",
  withCredentials: true,
});

[Userapi, Postapi].forEach((instance) => {
  instance.interceptors.response.use(
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
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Get current user from backend (/me)
  const fetchUser = async () => {
    try {
      const { data } = await Userapi.get("/me");
      setUser(data.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // ---------- User Methods ----------

  const verifyOTP = async ({ verificationId, otp }) => {
    try {
      const { data } = await Userapi.post("/verifyOTP", {
        verificationId,
        otp,
      });
      setUser(data.data);
      return data;
    } catch (err) {
      throw normalizeError(err);
    }
  };

  //onboard user
  const onBoardUser = async ({ username, password, bio, email }) => {
    try {
      const { data } = await Userapi.patch("/onboarding", {
        username,
        password,
        bio,
        email,
      });
      setUser(data.data);
      return data;
    } catch (err) {
      throw normalizeError(err);
    }
  };

  //check-username availability
  const checkUsernameAvailability = async (username) => {
    try {
      const { data } = await Userapi.get("/username-check", {
        params: { username },
      });
      return data;
    } catch (err) {
      throw normalizeError(err);
    }
  };

  // ✅ Register
  const register = async ({ name, email }) => {
    try {
      const { data } = await Userapi.post("/register", {
        name,
        email,
      });
      if (data.data.status === "PENDING") {
        setUser(data.data);
      }
      return data;
    } catch (err) {
      throw normalizeError(err);
    }
  };

  // ✅ Login with username + password
  const login = async ({ username, password }) => {
    try {
      const { data } = await Userapi.post("/login", { username, password });
      setUser(data.data.loginnedUser);
      return data;
    } catch (err) {
      throw normalizeError(err);
    }
  };

  // ✅ Login with Google
  const loginWithGoogle = () => {
    window.location.href = "http://localhost:8000/api/v1/auth/google";
  };

  // ✅ Logout
  const logout = async () => {
    try {
      await Userapi.post("/logout");
      setUser(null);
    } catch (err) {
      throw normalizeError(err);
    }
  };

  const resetPasswordOTP = async (email) => {
    try {
      const { data } = await Userapi.post("/resetOTPsent", { email });
      return data;
    } catch (err) {
      throw normalizeError(err);
    }
  };

  const verifyResetPassword = async ({ verificationId, otp, newPassword }) => {
    try {
      const { data } = await Userapi.post("/reset-password", {
        verificationId,
        otp,
        newPassword,
      });
      return data;
    } catch (err) {
      throw normalizeError(err);
    }
  };

  // ---------- Post Methods ----------

  // Create Post
  const createPost = async ({ title, content, tags, coverImage }) => {
    try {
      const { data } = await Postapi.post("/create", {
        title,
        content,
        tags,
        coverImage,
      });

      setPosts(data);

      return data;
    } catch (err) {
      throw normalizeError(err);
    }
  };

  // ---------- Helper ----------
  const normalizeError = (err) => {
    return {
      message:
        err.response?.data?.message || err.message || "Something went wrong",
      errors: err.response?.data?.errors || [],
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        posts,
        loading,
        login,
        loginWithGoogle,
        register,
        logout,
        fetchUser,
        checkUsernameAvailability,
        onBoardUser,
        verifyOTP,
        resetPasswordOTP,
        verifyResetPassword,
        createPost,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Remove useAuth hook from this file
