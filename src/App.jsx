import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useAuth, AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";

// Components
import Login from "./components/Login";
import VerifyOtp from "./components/VerifyOtp";
import ClientOnBoardForm from "./components/ClientOnBoardForm";
import CandidateOnBoardForm from "./components/CandidateOnBoardForm";
import Home from "./components/Home";
import Layout from "./components/Layout";
import Profile from "./components/Profile";

function PrivateRoute({ userTypeAllowed }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" replace />;
  if (userTypeAllowed && user.userType !== userTypeAllowed)
    return <Navigate to="/" replace />;

  return <Outlet />;
}

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/verify-otp", element: <VerifyOtp /> },

  // Candidate routes
  {
    element: <PrivateRoute userTypeAllowed="candidate" />,
    children: [
      { path: "/candidate/onboard", element: <CandidateOnBoardForm /> },
      {
        path: "/candidate",
        element: <Layout />,
        children: [
          { path: "home", element: <Home /> },
          { path: "profile", element: <Profile /> },
        ],
      },
    ],
  },

  // Client routes
  {
    element: <PrivateRoute userTypeAllowed="client" />,
    children: [
      { path: "/client/onboard", element: <ClientOnBoardForm /> },
      {
        path: "/client",
        element: <Layout />,
        children: [
          { path: "home", element: <Home /> },
          { path: "profile", element: <Profile /> },
        ],
      },
    ],
  },

  { path: "*", element: <Navigate to="/" /> },
]);

function AppWrapper() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppWrapper />
      </NotificationProvider>
    </AuthProvider>
  );
}
