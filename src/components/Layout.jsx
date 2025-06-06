import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { FaBars } from "react-icons/fa";

export default function Layout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const defaultImage = "https://www.w3schools.com/howto/img_avatar.png"; // fallback image

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow py-4 px-8 flex justify-between items-center">
        <h1
          className="text-xl font-bold"
          onClick={() =>
            navigate(
              user.userType == "client" ? "/client/home" : "/candidate/home"
            )
          }
        >
          Home
        </h1>

        <div className="relative flex items-center gap-8">
          <div className="flex flex-col items-center text-sm text-gray-700">
            <img
              src={user.profilePic || user.logoUrl || defaultImage}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border"
            />
            <span className="mt-1">
              {user.name || user.organizationName || "User"}
            </span>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-xl mb-6 text-gray-700 hover:text-gray-900"
          >
            <FaBars />
          </button>

          {menuOpen && (
            <div className="absolute top-14 rounded right-0 bg-white border border-[lightgray] shadow-md rounded w-32 z-10">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  user.userType === "candidate"
                    ? navigate("/candidate/profile")
                    : navigate("/client/profile");
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="pt-30 px-6">
        <Outlet />
      </main>
    </div>
  );
}
