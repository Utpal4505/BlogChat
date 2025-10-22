import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

// ✅ axios instances
const Userapi = axios.create({
  baseURL: "http://localhost:8000/api/v1/users",
  withCredentials: true,
});

const Postapi = axios.create({
  baseURL: "http://localhost:8000/api/v1/posts",
  withCredentials: true,
});

const Bugapi = axios.create({
  baseURL: "http://localhost:8000/api/v1/report-bug",
  withCredentials: true,
});

const Feedbackapi = axios.create({
  baseURL: "http://localhost:8000/api/v1/feedback",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

[Userapi, Postapi, Bugapi, Feedbackapi].forEach((instance) => {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        // Skip only refresh-token endpoint
        if (originalRequest.url?.includes("/refresh-token")) {
          isRefreshing = false;
          processQueue(error, null);
          return Promise.reject(error);
        }

        // Queue check
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => instance(originalRequest))
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          await Userapi.post("/refresh-token");
          processQueue(null);
          isRefreshing = false;
          return instance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError);
          isRefreshing = false;
          console.error("Token refresh failed:", refreshError);
          return Promise.reject(refreshError);
        }
      }

      const { message, errors } = error.response?.data || {};
      return Promise.reject({
        message: message || "Something went wrong",
        errors: errors || [],
      });
    }
  );
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper
  const normalizeError = (err) => {
    return {
      message:
        err.response?.data?.message || err.message || "Something went wrong",
      errors: err.response?.data?.errors || [],
    };
  };

  // Get current logged-in user
  const fetchUser = async () => {
    try {
      const { data } = await Userapi.get("/me");
      setUser(data.data);
    } catch (err) {
      console.error("Fetching user failed:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // ---------- Auth Methods ----------

  const register = async ({ name, email }) => {
    try {
      const { data } = await Userapi.post("/register", { name, email });
      if (data.data.status === "PENDING") {
        setUser(data.data);
      }
      return data;
    } catch (err) {
      throw normalizeError(err);
    }
  };

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

  const login = async ({ username, password }) => {
    try {
      const { data } = await Userapi.post("/login", { username, password });
      setUser(data.data.loginnedUser);
      return data;
    } catch (err) {
      throw normalizeError(err);
    }
  };

  const loginWithGoogle = () => {
    window.location.href = "http://localhost:8000/api/v1/auth/google";
  };

  const logout = async () => {
    try {
      await Userapi.post("/logout");
      setUser(null);
      isRefreshing = false;
      failedQueue = [];
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

  // ---------- User Profile Methods ----------

  const getUserProfile = async (username) => {
    try {
      const { data } = await Userapi.get(`/profile/${username}`);
      return data;
    } catch (error) {
      throw normalizeError(error);
    }
  };

  const updateUserProfile = async ({ bio, name, email }) => {
    try {
      const { data } = await Userapi.patch("/me/update", {
        bio,
        name,
        email,
      });
      setUser(data.data);
      return data;
    } catch (error) {
      throw normalizeError(error);
    }
  };

  const updateAvatar = async (avatarFile) => {
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      const { data } = await Userapi.patch("/me/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(data.data);
      return data;
    } catch (error) {
      throw normalizeError(error);
    }
  };

  const deleteUser = async () => {
    try {
      const { data } = await Userapi.delete("/delete");
      setUser(null);
      return data;
    } catch (error) {
      throw normalizeError(error);
    }
  };

  const getUserPosts = async (username) => {
    try {
      const { data } = await Userapi.get(`/profile/${username}/posts`);
      return data;
    } catch (error) {
      throw normalizeError(error);
    }
  };

  // ---------- Follow Method ----------

  const toggleFollow = async (userId) => {
    try {
      const { data } = await Userapi.post(`/${userId}/follow`);
      return data;
    } catch (error) {
      throw normalizeError(error);
    }
  };

  // ---------- Post Methods ----------

  const createPost = async ({ title, content, tags, coverImage }) => {
    try {
      const { data } = await Postapi.post("/create", {
        title,
        content,
        tags,
        coverImage,
      });
      return data;
    } catch (err) {
      throw normalizeError(err);
    }
  };

  const getPostById = async (postId) => {
    try {
      const { data } = await Postapi.get(`/post/${postId}`);
      return data;
    } catch (error) {
      throw normalizeError(error);
    }
  };

  const getFeedPosts = async () => {
    try {
      const { data } = await Postapi.get("/feed");
      return data;
    } catch (error) {
      throw normalizeError(error);
    }
  };

  const likePost = async (postId) => {
    try {
      const { data } = await Postapi.post(`/post/${postId}/like`);
      return data;
    } catch (error) {
      throw normalizeError(error);
    }
  };

  const updatePost = async (postId, { title, content, tags, coverImage }) => {
    try {
      const formData = new FormData();
      if (title) formData.append("title", title);
      if (content) formData.append("content", content);
      if (tags) formData.append("tags", JSON.stringify(tags));
      if (coverImage) formData.append("coverImage", coverImage);

      const { data } = await Postapi.patch(`/update/${postId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    } catch (error) {
      throw normalizeError(error);
    }
  };

  const deletePost = async (postId) => {
    try {
      const { data } = await Postapi.delete(`/delete/${postId}`);
      return data;
    } catch (error) {
      throw normalizeError(error);
    }
  };

  const getPostComments = async (postId) => {
    try {
      const { data } = await Postapi.get(`/post/${postId}/comments`);
      return data;
    } catch (error) {
      throw normalizeError(error);
    }
  };

  const createComment = async (postId, commentContent) => {
    try {
      const { data } = await Postapi.post(`/post/${postId}/comment`, {
        content: commentContent,
      });
      return data;
    } catch (error) {
      throw normalizeError(error);
    }
  };

  const toggleBookmark = async (postId) => {
    try {
      const { data } = await Postapi.post(`/post/${postId}/bookmarks`);
      return data;
    } catch (error) {
      throw normalizeError(error);
    }
  };

  const getBookmarkPosts = async () => {
    try {
      const { data } = await Postapi.get("/bookmarks");
      return data;
    } catch (error) {
      throw normalizeError(error);
    }
  }

  // ---------- Bug & Feedback ----------

  const create_Bug = async ({ bugPayload, recaptchaToken }) => {
    try {
      const { data } = await Bugapi.post("/", {
        bugPayload,
        recaptchaToken,
      });
      return data;
    } catch (error) {
      throw normalizeError(error);
    }
  };

  const create_Feedback = async ({ feedbackPayload, recaptchaToken }) => {
    try {
      const { data } = await Feedbackapi.post("/", {
        feedbackPayload,
        recaptchaToken,
      });
      return data;
    } catch (error) {
      throw normalizeError(error);
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
        resetPasswordOTP,
        verifyResetPassword,
        getUserProfile,
        updateUserProfile,
        updateAvatar,
        deleteUser,
        toggleFollow,
        getUserPosts,
        createPost,
        getPostById,
        getFeedPosts,
        likePost,
        updatePost,
        deletePost,
        getPostComments,
        createComment,
        create_Bug,
        create_Feedback,
        toggleBookmark,
        getBookmarkPosts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
