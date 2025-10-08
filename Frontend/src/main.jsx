import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../pages/Login.jsx";
import SignUp from "../pages/SignUp.jsx";
import Onboarding from "../pages/Onboarding.jsx";
import Dashboard from "../pages/dashboard.jsx";
import { AuthProvider } from "../context/AuthContext.jsx";
import VerificationForm from "../pages/EmailVerification.jsx";
import ForgetPassword from "../pages/ForgetPassword.jsx";
import PasswordVerify from "../pages/PasswordVerify.jsx";
import NewPassword from "../pages/NewPassword.jsx";
import ProtectedRoute from "../utils/ProtectedRoute.jsx";
import MinimalLayout from "./layouts/MinimalLayout.jsx";
import App from "./App.jsx";
import BlogEditor from "../pages/Write.jsx";

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
        ],
      },
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
          {
            path: "Write-Blog",
            element: <BlogEditor />,
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
