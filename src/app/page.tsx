"use client";

import { useState, useEffect, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import SobrietyCounter from "@/components/SobrietyCounter";
import Journal from "@/components/Journal";
import AIChat from "@/components/AIChat";
import ProgressGraph from "@/components/ProgressGraph";

interface JournalEntry {
  date: Date;
  mood: string;
  triggers: string[];
  notes: string;
}

const Fireworks = () => {
  const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black animate-overlay" />

      {/* Encouragement Message */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-4xl font-bold text-center animate-encourage">
          <span className="block animate-bounce text-blue-400">
            You Can Do This!
          </span>
          <span className="block text-2xl mt-2 animate-pulse text-blue-300">
            Your journey begins today
          </span>
        </div>
      </div>

      {/* Fireworks */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 60}%`,
            animation: `firework ${2.5 + Math.random() * 0.5}s ease-out forwards`,
            animationDelay: `${Math.random() * 0.3}s`,
          }}
        >
          {[...Array(12)].map((_, j) => (
            <div
              key={j}
              className="absolute w-4 h-4 rounded-full"
              style={
                {
                  backgroundColor:
                    colors[Math.floor(Math.random() * colors.length)],
                  transform: `rotate(${j * 30}deg) translateY(-40px)`,
                  animation: `sparkle ${1.5 + Math.random() * 0.4}s ease-out forwards`,
                  animationDelay: `${Math.random() * 0.2}s`,
                  "--rotation": `${j * 30}deg`,
                  boxShadow: "0 0 8px 3px rgba(255, 255, 255, 0.6)",
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      ))}
      <style jsx global>{`
        @keyframes firework {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        @keyframes sparkle {
          0% {
            transform: rotate(var(--rotation)) translateY(0);
            opacity: 1;
          }
          100% {
            transform: rotate(var(--rotation)) translateY(150px);
            opacity: 0;
          }
        }
        @keyframes encourage {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          20% {
            opacity: 1;
            transform: scale(1);
          }
          80% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1.2);
          }
        }
        @keyframes overlay {
          0% {
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          80% {
            opacity: 0.8;
          }
          100% {
            opacity: 0;
          }
        }
        .animate-encourage {
          animation: encourage 10s ease-in-out forwards;
          text-shadow:
            0 0 15px rgba(255, 255, 255, 0.8),
            0 0 30px rgba(255, 255, 255, 0.4);
        }
        .animate-overlay {
          animation: overlay 10s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default function Home() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [showFireworks, setShowFireworks] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  // Calculate time elapsed since start date
  const getTimeElapsed = () => {
    if (!startDate) return 0;
    const now = new Date();
    return now.getTime() - startDate.getTime();
  };

  // Check if milestone is achieved
  const isMilestoneAchieved = (hours: number) => {
    const timeElapsed = getTimeElapsed();
    return timeElapsed >= hours * 60 * 60 * 1000;
  };

  useEffect(() => {
    // Load start date from localStorage
    const savedDate = localStorage.getItem("sobrietyStartDate");
    if (savedDate) {
      setStartDate(new Date(savedDate));
    }

    // Load journal entries from localStorage
    const savedEntries = localStorage.getItem("journalEntries");
    if (savedEntries) {
      const parsedEntries = JSON.parse(savedEntries).map(
        (entry: Omit<JournalEntry, "date"> & { date: string }) => ({
          ...entry,
          date: new Date(entry.date),
        })
      );
      setJournalEntries(parsedEntries);
    }
  }, []);

  // Prevent scrolling on state change
  useEffect(() => {
    if (startDate) {
      const scrollPosition = window.scrollY;
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollPosition);
      });
    }
  }, [startDate]);

  // Update localStorage when entries change
  useEffect(() => {
    if (journalEntries.length > 0) {
      localStorage.setItem("journalEntries", JSON.stringify(journalEntries));
    } else {
      localStorage.removeItem("journalEntries");
    }
  }, [journalEntries]);

  const handleSetStartDate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const today = new Date();
    setStartDate(today);
    localStorage.setItem("sobrietyStartDate", today.toISOString());
    setShowFireworks(true);
    setTimeout(() => setShowFireworks(false), 10000);
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.top = `-${window.scrollY}px`;
    setTimeout(() => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    }, 100);
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
    <main
      className="min-h-screen bg-gradient-to-b from-blue-50 to-white overflow-x-hidden"
      ref={mainRef}
    >
      <Toaster />
      {showFireworks && <Fireworks />}
      <div className="container mx-auto px-4 py-8 overflow-x-hidden">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">
          Your Journey to Sobriety
        </h1>

        {startDate ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <SobrietyCounter
                startDate={startDate}
                onResetAction={handleResetTimer}
              />
              <AIChat />
            </div>
            <Journal onEntriesChange={setJournalEntries} />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">
              Set Your Sobriety Start Date
            </h2>
            <button
              onClick={handleSetStartDate}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
              type="button"
            >
              Start Today
            </button>
          </div>
        )}

        {/* Progress Graph */}
        {startDate && journalEntries.length > 0 && (
          <div className="mt-8">
            <ProgressGraph entries={journalEntries} />
          </div>
        )}

        {/* Milestones & Achievements Section */}
        {startDate && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">
              Milestones & Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                className={`p-4 rounded-lg transition-all duration-300 ${
                  isMilestoneAchieved(24)
                    ? "bg-green-100 border-2 border-green-500"
                    : "bg-blue-50"
                }`}
              >
                <h3 className="text-lg font-medium text-blue-700 mb-2">
                  24 Hours
                </h3>
                <p className="text-gray-600">
                  First day of sobriety - a crucial step in your journey
                </p>
                {isMilestoneAchieved(24) && (
                  <div className="mt-2 text-green-600 font-medium">
                    ✓ Achieved!
                  </div>
                )}
              </div>
              <div
                className={`p-4 rounded-lg transition-all duration-300 ${
                  isMilestoneAchieved(720)
                    ? "bg-green-100 border-2 border-green-500"
                    : "bg-blue-50"
                }`}
              >
                <h3 className="text-lg font-medium text-blue-700 mb-2">
                  30 Days
                </h3>
                <p className="text-gray-600">
                  One month milestone - physical improvements begin
                </p>
                {isMilestoneAchieved(720) && (
                  <div className="mt-2 text-green-600 font-medium">
                    ✓ Achieved!
                  </div>
                )}
              </div>
              <div
                className={`p-4 rounded-lg transition-all duration-300 ${
                  isMilestoneAchieved(2160)
                    ? "bg-green-100 border-2 border-green-500"
                    : "bg-blue-50"
                }`}
              >
                <h3 className="text-lg font-medium text-blue-700 mb-2">
                  90 Days
                </h3>
                <p className="text-gray-600">
                  Three months - significant progress in recovery
                </p>
                {isMilestoneAchieved(2160) && (
                  <div className="mt-2 text-green-600 font-medium">
                    ✓ Achieved!
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Each milestone is a victory worth celebrating. Keep going!
              </p>
            </div>
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
