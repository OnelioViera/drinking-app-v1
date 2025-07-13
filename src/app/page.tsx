"use client";

import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import SobrietyCounter from "@/components/SobrietyCounter";
import Journal from "@/components/Journal";
import AIChat from "@/components/AIChat";
import ProgressGraph from "@/components/ProgressGraph";
import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";

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
      <div className="absolute inset-0 bg-blue-100 animate-overlay" />

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
  const { isSignedIn, user } = useUser();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!isSignedIn || !user) return;

    // Load start date from localStorage with user-specific key
    const userStartDateKey = `sobrietyStartDate_${user.id}`;
    const savedDate = localStorage.getItem(userStartDateKey);
    if (savedDate) {
      setStartDate(new Date(savedDate));
    }

    // Load journal entries from localStorage with user-specific key
    const userEntriesKey = `journalEntries_${user.id}`;
    const savedEntries = localStorage.getItem(userEntriesKey);
    if (savedEntries) {
      const parsedEntries = JSON.parse(savedEntries).map(
        (entry: Omit<JournalEntry, "date"> & { date: string }) => ({
          ...entry,
          date: new Date(entry.date),
        })
      );
      setJournalEntries(parsedEntries);
    }
  }, [isSignedIn, user]);

  // Update localStorage when entries change
  useEffect(() => {
    if (!isSignedIn || !user) return;

    const userEntriesKey = `journalEntries_${user.id}`;
    if (journalEntries.length > 0) {
      localStorage.setItem(userEntriesKey, JSON.stringify(journalEntries));
    } else {
      localStorage.removeItem(userEntriesKey);
    }
  }, [journalEntries, isSignedIn, user]);

  const handleSetStartDate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;

    const today = new Date();
    setStartDate(today);
    const userStartDateKey = `sobrietyStartDate_${user.id}`;
    localStorage.setItem(userStartDateKey, today.toISOString());
    setShowFireworks(true);
    setTimeout(() => setShowFireworks(false), 10000);
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-blue-600 mb-6">
              Your Journey to Sobriety Starts Here
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Take control of your life with our comprehensive sobriety tracking
              tool. Track your progress, celebrate milestones, and build a
              healthier future.
            </p>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">
                Track Your Progress
              </h3>
              <p className="text-gray-600">
                Monitor your sobriety journey with our intuitive counter and
                progress tracking tools.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">
                Journal Your Journey
              </h3>
              <p className="text-gray-600">
                Record your thoughts, feelings, and milestones in your personal
                journal.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">
                Get Support
              </h3>
              <p className="text-gray-600">
                Access AI-powered support and resources to help you stay on
                track.
              </p>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
            <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
              Benefits of Starting Your Sobriety Journey
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-blue-600 mb-3">
                  Physical Benefits
                </h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Improved sleep quality</li>
                  <li>Better physical health</li>
                  <li>Increased energy levels</li>
                  <li>Clearer thinking</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-600 mb-3">
                  Mental Benefits
                </h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Reduced anxiety and stress</li>
                  <li>Better emotional stability</li>
                  <li>Improved relationships</li>
                  <li>Greater self-confidence</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-600 mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of others who have taken the first step towards a
              better life.
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Your Journey Today
            </button>
          </div>

          {/* Auth Modal */}
          {showAuthModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <h3 className="text-2xl font-bold text-blue-600 mb-6 text-center">
                  Choose Your Path
                </h3>
                <div className="space-y-4">
                  <SignInButton mode="modal">
                    <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="w-full bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors">
                      Create Account
                    </button>
                  </SignUpButton>
                  <button
                    onClick={() => setShowAuthModal(false)}
                    className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show welcome screen for new users
  if (isSignedIn && !startDate) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-center" />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-blue-600 mb-6">
              Welcome to Your Sobriety Journey
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Take the first step towards a healthier, happier life. Let&apos;s
              begin tracking your progress together.
            </p>
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-semibold text-blue-700 mb-4">
                Ready to Start?
              </h2>
              <p className="text-gray-600 mb-6">
                Click the button below to begin your journey. We&apos;ll help
                you track your progress, celebrate milestones, and build a
                stronger future.
              </p>
              <button
                onClick={handleSetStartDate}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Start My Journey
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      {showFireworks && <Fireworks />}

      <div className="container mx-auto h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          <div className="space-y-8 p-8">
            <SobrietyCounter
              startDate={startDate}
              onSetStartDateAction={handleSetStartDate}
            />
            <AIChat />
            <ProgressGraph entries={journalEntries} />
          </div>
          <div className="p-8">
            <Journal onEntriesChange={setJournalEntries} />
          </div>
        </div>
      </div>
    </div>
  );
}
