"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

interface SobrietyCounterProps {
  startDate: Date | null;
  onSetStartDateAction: (e: React.MouseEvent) => void;
}

export default function SobrietyCounter({
  startDate,
  onSetStartDateAction,
}: SobrietyCounterProps) {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [showResetWarning, setShowResetWarning] = useState(false);

  useEffect(() => {
    if (!startDate) return;

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
    setShowResetWarning(true);
  };

  const confirmReset = () => {
    onSetStartDateAction({} as React.MouseEvent);
    setShowResetWarning(false);
    toast.success("Timer has been reset. Your new journey begins now!");
  };

  const cancelReset = () => {
    setShowResetWarning(false);
  };

  if (!startDate) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">
            Start Your Sobriety Journey
          </h2>
          <p className="text-gray-600 mb-4">
            Begin tracking your progress towards a healthier life
          </p>
          <button
            onClick={onSetStartDateAction}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Start Today
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-700">
          Your Sobriety Journey
        </h2>
        <button
          onClick={handleReset}
          className="text-red-600 hover:text-red-700 text-sm font-medium"
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

      {/* Reset Warning Modal */}
      {showResetWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-red-600 mb-4">
              Warning: Reset Timer
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to reset your timer? This will start your
              journey from today and cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={confirmReset}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
              >
                Yes, Reset
              </button>
              <button
                onClick={cancelReset}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
