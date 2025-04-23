"use client";

import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import SobrietyCounter from "@/components/SobrietyCounter";
import Journal from "@/components/Journal";

export default function Home() {
  const [startDate, setStartDate] = useState<Date | null>(null);

  useEffect(() => {
    // Load start date from localStorage
    const savedDate = localStorage.getItem("sobrietyStartDate");
    if (savedDate) {
      setStartDate(new Date(savedDate));
    }
  }, []);

  const handleSetStartDate = () => {
    const today = new Date();
    setStartDate(today);
    localStorage.setItem("sobrietyStartDate", today.toISOString());
    toast.success("Sobriety timer started!", {
      duration: 4000,
      position: "top-center",
      style: {
        background: "#4CAF50",
        color: "#fff",
        padding: "16px",
        borderRadius: "8px",
      },
    });
  };

  const handleResetTimer = () => {
    localStorage.removeItem("sobrietyStartDate");
    setStartDate(null);
    toast.error("Sobriety timer reset", {
      duration: 4000,
      position: "top-center",
      style: {
        background: "#f44336",
        color: "#fff",
        padding: "16px",
        borderRadius: "8px",
      },
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Toaster />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">
          Your Journey to Sobriety
        </h1>

        {startDate ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SobrietyCounter
              startDate={startDate}
              onResetAction={handleResetTimer}
            />
            <Journal />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">
              Set Your Sobriety Start Date
            </h2>
            <button
              onClick={handleSetStartDate}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              Start Today
            </button>
          </div>
        )}

        {/* Resources Section */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">
            Emergency Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Helplines
              </h3>
              <ul className="space-y-2">
                <li className="text-blue-600 hover:text-blue-800">
                  <a href="tel:1-800-662-4357">
                    SAMHSA Helpline: 1-800-662-4357
                  </a>
                </li>
                <li className="text-blue-600 hover:text-blue-800">
                  <a href="tel:1-800-273-8255">
                    National Suicide Prevention Lifeline: 1-800-273-8255
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Support Groups
              </h3>
              <ul className="space-y-2">
                <li className="text-blue-600 hover:text-blue-800">
                  <a
                    href="https://www.aa.org"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Alcoholics Anonymous
                  </a>
                </li>
                <li className="text-blue-600 hover:text-blue-800">
                  <a
                    href="https://www.smartrecovery.org"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    SMART Recovery
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="mt-8 text-center">
          <blockquote className="text-xl text-gray-600 italic">
            &ldquo;Recovery is hard. Regret is harder.&rdquo;
          </blockquote>
        </div>
      </div>
    </main>
  );
}
