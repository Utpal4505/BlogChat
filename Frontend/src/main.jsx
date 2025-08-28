import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from '../pages/Login.jsx'
import SignUp from '../pages/SignUp.jsx'
import Onboarding from '../pages/Onboarding.jsx'
import Dashboard from '../pages/dashboard.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: "login",
        element: <Login />
      },
      {
        path: "register",
        element: <SignUp />
      },
      {
        path: "onboarding",
        element: <Onboarding />
      },
      {
        path: "dashboard",
        element: <Dashboard />
      },

    ]
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
