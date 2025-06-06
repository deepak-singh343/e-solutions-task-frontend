import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "12px",
  boxShadow: "0 4px 0px rgba(0, 0, 0, 0.1)",
};

export default function CurrentLocationMap() {
  const [position, setPosition] = useState(null);
  const [locationDenied, setLocationDenied] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCgBPaLiHzsH2yQIlAlKJKmBhsQ8YTe8Oo", // 🔑 Replace with your actual key
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition({ lat: latitude, lng: longitude });
      },
      (err) => {
        console.warn("Geolocation error:", err);
        setLocationDenied(true);
      }
    );
  }, []);

  if (!isLoaded) return <p>Loading Map...</p>;

  return (
    <div className="bg-white md:p-8 p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Your Current Location
      </h2>
      {locationDenied ? (
        <div className="p-6 bg-yellow-100 text-yellow-800 rounded-lg shadow">
          <p>
            Location access is not granted. Please enable location services to
            view your current location on the map.
          </p>
        </div>
      ) : position ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={position}
          zoom={14}
        >
          <Marker position={position} />
        </GoogleMap>
      ) : (
        <p className="text-gray-500">Fetching your current location...</p>
      )}
    </div>
  );
}
