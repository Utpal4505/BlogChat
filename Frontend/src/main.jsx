/* eslint-disable no-unused-vars */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../pages/Login.jsx";
import SignUp from "../pages/SignUp.jsx";
import Onboarding from "../pages/Onboarding.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import { AuthProvider } from "../context/AuthContext.jsx";
import VerificationForm from "../pages/EmailVerification.jsx";
import ForgetPassword from "../pages/ForgetPassword.jsx";
import PasswordVerify from "../pages/PasswordVerify.jsx";
import NewPassword from "../pages/NewPassword.jsx";
import ProtectedRoute from "../utils/ProtectedRoute.jsx";
import MinimalLayout from "./layouts/MinimalLayout.jsx";
import App from "./App.jsx";
import BlogEditor from "../pages/Write.jsx";
import ReportBug from "../pages/ReportBug.jsx";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import Feedback from "../pages/Feedback.jsx";
import ProfilePage from "../pages/Profile.jsx";
import SettingsPage from "../pages/Setings.jsx";

const MAX_CONSOLE_ERRORS = 5;
export const consoleErrors = [];

// Save original console.error
const originalConsoleError = console.error;

// Override console.error
console.error = function (...args) {
  const message = args
    .map((a) => (typeof a === "object" ? JSON.stringify(a) : a))
    .join(" ");

  // Add to array
  consoleErrors.push({
    message,
    timestamp: new Date().toISOString(),
  });

  // Keep only last MAX_CONSOLE_ERRORS entries
  if (consoleErrors.length > MAX_CONSOLE_ERRORS) {
    consoleErrors.shift(); // remove oldest
  }

  // Still log to console normally
  originalConsoleError.apply(console, args);
};

const withReCaptcha = (Component) => (
  <GoogleReCaptchaProvider
    reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
    scriptProps={{ async: true, defer: true, appendTo: "body" }}
  >
    <Component />
  </GoogleReCaptchaProvider>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      //Protected Routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "Write-Blog",
            element: <BlogEditor />,
          },
        ],
      },
      {
        path: "report-bug",
        element: withReCaptcha(ReportBug),
      },
      {
        path: "feedback",
        element: withReCaptcha(Feedback),
      },
      // ✅ Profile routes (order matters!)
      {
        path: "profile/:username", // Dynamic username route
        element: <ProfilePage />,
      },
      {
        path: "profile", // Own profile (no username)
        element: <ProfilePage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      }
    ],
  },

  {
    element: <MinimalLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <SignUp />,
      },
      {
        path: "email-verification",
        element: <VerificationForm />,
      },
      {
        path: "forgot-password",
        element: <ForgetPassword />,
      },
      {
        path: "verifyOTP",
        element: <PasswordVerify />,
      },
      {
        path: "NewPassword",
        element: <NewPassword />,
      },

      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "onboarding",
            element: <Onboarding />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
