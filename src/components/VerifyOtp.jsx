import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";

export default function VerifyOtp() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { login } = useAuth();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!state || !state.email || !state.userType) {
    navigate("/");
    return null;
  }

  const verifyOtp = async () => {
    setError("");
    if (!otp) return setError("Please enter the OTP");
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: state.email, otp }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        showNotification(data.message || "OTP verification failed", "error");
        return;
      }

      const userRef = doc(db, "users", state.email);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const fullUserData = userSnap.data();
        let userData = {};
        if (fullUserData.userType == "candidate") {
          userData = {
            token: parsedUser.token,
            email: fullUserData.email,
            userType: fullUserData.userType,
            name: fullUserData.name,
            profilePic: fullUserData.profilePic || null,
            address: fullUserData.address,
            phone: fullUserData.phone,
            gender: fullUserData.gender,
          };
        } else {
          userData = {
            organizationName: fullUserData.organizationName,
            contactPerson: fullUserData.contactPerson,
            industry: fullUserData.industry,
            logoUrl: fullUserData.logoUrl,
            userType: fullUserData.userType,
            address: fullUserData.address,
            email: fullUserData.email,
            phone: fullUserData.phone,
          };
        }
        login(userData);

        if (userData.userType === "candidate") {
          navigate("/candidate/home");
        } else if (userData.userType === "client") {
          navigate("/client/home");
        } else {
          navigate("/");
        }
      } else {
        login({
          token: data.token,
          email: state.email,
          userType: state.userType,
        });

        if (state.userType === "candidate") {
          navigate("/candidate/onboard");
        } else if (state.userType === "client") {
          navigate("/client/onboard");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-600 to-blue-400 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Verify OTP
        </h1>

        <p className="mb-4 text-gray-700 text-center">
          Enter the OTP sent to <strong>{state.email}</strong>
        </p>

        <input
          type="text"
          className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 text-center tracking-widest text-xl"
          maxLength={6}
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        {error && (
          <div className="mb-4 text-red-600 font-semibold text-center">
            {error}
          </div>
        )}

        <button
          onClick={verifyOtp}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded transition"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
}
