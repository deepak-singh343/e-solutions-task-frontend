import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { uploadToCloudinary } from "../service/helper";

export default function CandidateOnBoardForm() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      let imageUrl = "";
      setSubmitting(true);

      if (data.profilePic[0]) {
        imageUrl = await uploadToCloudinary(data.profilePic[0]);
      }

      const userDoc = {
        name: data.name,
        gender: data.gender,
        address: data.address,
        phone: data.phone,
        profilePic: imageUrl,
        email: user.email,
        userType: user.userType,
        createdAt: new Date(),
      };

      await setDoc(doc(db, "users", user.email), userDoc);
      login({ ...user, ...userDoc });
      navigate("/candidate/home");
    } catch (error) {
      console.error("Error saving user data:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Complete Your Profile
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Full Name
          </label>
          <input
            {...register("name", { required: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring focus:ring-indigo-300"
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">Name is required</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Gender
          </label>
          <select
            {...register("gender", { required: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring focus:ring-indigo-300"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && (
            <p className="text-red-600 text-sm mt-1">Gender is required</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Address
          </label>
          <textarea
            {...register("address", { required: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring focus:ring-indigo-300"
            placeholder="Your current address"
          ></textarea>
          {errors.address && (
            <p className="text-red-600 text-sm mt-1">Address is required</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Contact Number
          </label>
          <input
            type="tel"
            {...register("phone", {
              required: true,
              pattern: /^[0-9]{10}$/,
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring focus:ring-indigo-300"
            placeholder="9876543210"
          />
          {errors.phone && (
            <p className="text-red-600 text-sm mt-1">
              Valid phone number is required
            </p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-1">
            Profile Picture
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("profilePic", { required: true })}
            onChange={(e) =>
              setImagePreview(URL.createObjectURL(e.target.files[0]))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring focus:ring-indigo-300"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-4 w-24 h-24 object-cover rounded-full mx-auto shadow-md"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg transition"
        >
          {submitting ? "Submitting" : "Submit"}
        </button>
      </form>
    </div>
  );
}
