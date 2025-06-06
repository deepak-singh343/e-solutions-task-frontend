import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { uploadToCloudinary } from "../service/helper";
import { useNotification } from "../context/NotificationContext";

export default function ClientOnBoardForm() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [submitting, setSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  if (!user) {
    navigate("/");
    return null;
  }

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      let logoUrl = "";

      if (data.logo && data.logo[0]) {
        logoUrl = await uploadToCloudinary(data.logo[0]);
      }

      const clientData = {
        organizationName: data.organizationName,
        contactPerson: data.contactPerson,
        phone: data.phone,
        address: data.address,
        industry: data.industry,
        logoUrl,
        email: user.email,
        userType: user.userType,
        createdAt: new Date(),
      };

      await setDoc(doc(db, "users", user.email), clientData);

      login({ ...user, ...clientData });
      navigate("/client/home");
    } catch (error) {
      console.error("Error saving client data:", error);
      showNotification(
        "Failed to save client data. Please try again.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-400 to-blue-500 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Client Onboarding
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Organization Name
            </label>
            <input
              {...register("organizationName", { required: true })}
              className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.organizationName && (
              <span className="text-red-500 text-sm">
                This field is required
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contact Person
            </label>
            <input
              {...register("contactPerson", { required: true })}
              className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.contactPerson && (
              <span className="text-red-500 text-sm">
                This field is required
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              {...register("phone", { required: true, pattern: /^[0-9]{10}$/ })}
              placeholder="e.g. 9876543210"
              className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.phone && (
              <span className="text-red-500 text-sm">
                Valid 10-digit phone number required
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
              {...register("address", { required: true })}
              className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.address && (
              <span className="text-red-500 text-sm">Address is required</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Industry
            </label>
            <input
              {...register("industry", { required: true })}
              className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Company Logo (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("logo")}
              onChange={(e) => {
                if (e.target.files[0]) {
                  setLogoPreview(URL.createObjectURL(e.target.files[0]));
                }
              }}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:ring focus:ring-indigo-300"
            />
            {logoPreview && (
              <img
                src={logoPreview}
                alt="Logo Preview"
                className="mt-4 w-24 h-24 object-cover rounded-full mx-auto shadow-md"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition"
          >
            {submitting ? "Submitting" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
