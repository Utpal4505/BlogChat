import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
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
import WriteBlog from "../pages/Write.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
        path: "Write-Blog",
        element: <WriteBlog />,
      },

      //Protected Routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
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
