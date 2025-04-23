"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

interface SobrietyCounterProps {
  startDate: Date;
  onResetAction: () => void;
}

export default function SobrietyCounter({
  startDate,
  onResetAction,
}: SobrietyCounterProps) {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setDays(days);
      setHours(hours);
      setMinutes(minutes);
      setSeconds(seconds);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000); // Update every second

    return () => clearInterval(interval);
  }, [startDate]);

  const handleReset = () => {
    toast(
      (t) => (
        <div className="flex flex-col items-center">
          <p className="mb-2">
            Are you sure you want to reset your sobriety timer?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                onResetAction();
                toast.dismiss(t.id);
              }}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Yes, Reset
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
        position: "top-center",
        style: {
          background: "#fff",
          color: "#333",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
      }
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-700">
          Your Sobriety Journey
        </h2>
        <button
          onClick={handleReset}
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
        >
          Reset Timer
        </button>
      </div>
      <div className="text-center">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-4xl font-bold text-blue-600">{days}</p>
            <p className="text-gray-600">Days</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-blue-600">{hours}</p>
            <p className="text-gray-600">Hours</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-blue-600">{minutes}</p>
            <p className="text-gray-600">Minutes</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-blue-600">{seconds}</p>
            <p className="text-gray-600">Seconds</p>
          </div>
        </div>
        <p className="mt-4 text-gray-600">
          Started on {startDate.toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
