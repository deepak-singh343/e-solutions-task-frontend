import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("candidate");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const sendOtp = async () => {
    setError("");
    if (!email) return setError("Please enter your email");

    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/send-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, userType }),
        }
      );
      const data = await res.json();

      if (!res.ok) {
        showNotification(data.message || "Failed to send OTP", "error");
        return;
      }

      showNotification("OTP sent! Check your email.");
      navigate("/verify-otp", { state: { email, userType } });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-400 to-purple-600 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Onboarding Portal Login
        </h1>

        <label className="block mb-2 font-semibold text-gray-700">Email</label>
        <input
          type="email"
          className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block mb-2 font-semibold text-gray-700">I am a</label>
        <select
          className="w-full p-2 border rounded mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
        >
          <option value="candidate">Candidate (Joiner)</option>
          <option value="client">Client</option>
        </select>

        {error && (
          <div className="mb-4 text-red-600 font-semibold text-center">
            {error}
          </div>
        )}

        <button
          onClick={sendOtp}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </div>
    </div>
  );
}
