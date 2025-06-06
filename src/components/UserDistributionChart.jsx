import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useAuth } from "../context/authContext";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function UserDistributionChart({
  candidates = [],
  clients = [],
}) {
  const { user } = useAuth();
  const [selected, setSelected] = useState(user.userType);

  const handleClick = (evt, elements) => {
    if (!elements.length) return;
    const index = elements[0].index;
    const clicked = chartData.labels[index];
    setSelected(clicked.toLowerCase());
  };

  const chartData = {
    labels: ["Candidates", "Clients"],
    datasets: [
      {
        label: "User Distribution",
        data: [candidates.length, clients.length],
        backgroundColor: ["#4F46E5", "#10B981"],
        hoverOffset: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // For better control in small screens
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    onClick: handleClick,
  };

  const details = selected.includes("candidate") ? candidates : clients;

  return (
    <div className="w-full md:p-8 p-6 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-20 items-start">
        <div className="w-full h-[350px] mb-4">
          <Pie data={chartData} options={chartOptions} />
        </div>

        {selected && (
          <div className="w-full">
            <h3 className="text-2xl font-bold text-black-00 mb-4 text-center">
              {selected.toUpperCase()} DETAILS
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {details.map((user, i) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition duration-200"
                >
                  <div className="mb-2">
                    <p className="text-lg font-semibold text-gray-800">
                      {user.name
                        ? `Name: ${user.name}`
                        : `Organization: ${user.organizationName}`}
                    </p>
                  </div>
                  <div className="text-sm text-gray-600">
                    📧Email: <span className="break-words"> {user.email}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
