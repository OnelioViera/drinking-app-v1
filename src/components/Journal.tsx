"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { useUser } from "@clerk/nextjs";

interface JournalEntry {
  _id?: string;
  date: Date;
  mood: string;
  triggers: string[];
  notes: string;
}

interface JournalProps {
  onEntriesChange?: (entries: JournalEntry[]) => void;
}

export default function Journal({ onEntriesChange }: JournalProps) {
  const { user, isLoaded } = useUser();
  const [entry, setEntry] = useState<JournalEntry>({
    date: new Date(),
    mood: "",
    triggers: [],
    notes: "",
  });

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Load entries from localStorage on component mount
  useEffect(() => {
    if (!isLoaded || !user) return;

    const storageKey = `journalEntries_${user.id}`;
    const savedEntries = localStorage.getItem(storageKey);
    if (savedEntries) {
      const parsedEntries = JSON.parse(savedEntries).map(
        (entry: Omit<JournalEntry, "date"> & { date: string }) => ({
          ...entry,
          date: new Date(entry.date),
        })
      );
      setEntries(parsedEntries);
      onEntriesChange?.(parsedEntries);
    }
  }, [onEntriesChange, user, isLoaded]);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    if (!isLoaded || !user) return;

    const storageKey = `journalEntries_${user.id}`;
    localStorage.setItem(storageKey, JSON.stringify(entries));
    onEntriesChange?.(entries);
  }, [entries, user, isLoaded, onEntriesChange]);

  const moods = ["Great", "Good", "Neutral", "Anxious", "Stressed", "Tired"];

  const commonTriggers = [
    "Social Event",
    "Work Stress",
    "Family Issues",
    "Boredom",
    "Celebration",
  ];

  const handleMoodSelect = (mood: string) => {
    setEntry((prev) => ({ ...prev, mood }));
  };

  const handleTriggerToggle = (trigger: string) => {
    setEntry((prev) => ({
      ...prev,
      triggers: prev.triggers.includes(trigger)
        ? prev.triggers.filter((t) => t !== trigger)
        : [...prev.triggers, trigger],
    }));
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEntry((prev) => ({ ...prev, notes: e.target.value }));
  };

  const handleSave = async () => {
    if (!entry.mood) {
      toast.error("Please select your mood");
      return;
    }

    try {
      if (editingIndex !== null) {
        // Update existing entry
        const newEntries = [...entries];
        newEntries[editingIndex] = {
          ...entry,
          _id: entries[editingIndex]._id || Date.now().toString(),
        };
        setEntries(newEntries);
        toast.success("Journal entry updated!");
        setEditingIndex(null);
      } else {
        // Create new entry
        const newEntry = {
          ...entry,
          _id: Date.now().toString(),
        };
        const newEntries = [...entries, newEntry];
        setEntries(newEntries);
        toast.success("Journal entry saved!");
      }

      // Reset form
      setEntry({
        date: new Date(),
        mood: "",
        triggers: [],
        notes: "",
      });
    } catch (error) {
      console.error("Error saving entry:", error);
      toast.error("Failed to save journal entry");
    }
  };

  const handleEdit = (index: number) => {
    setEntry(entries[index]);
    setEditingIndex(index);
    toast.success("Editing entry...", {
      duration: 2000,
      position: "top-center",
      style: {
        background: "#2196F3",
        color: "#fff",
        padding: "16px",
        borderRadius: "8px",
      },
    });

    // Scroll to form after a short delay to ensure the form is rendered
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEntry({
      date: new Date(),
      mood: "",
      triggers: [],
      notes: "",
    });
  };

  const handleDelete = (index: number) => {
    try {
      const newEntries = entries.filter((_, i) => i !== index);
      setEntries(newEntries);
      toast.success("Entry deleted successfully!", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#4CAF50",
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
        },
      });
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast.error("Failed to delete entry");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div ref={formRef}>
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">
          {editingIndex !== null ? "Edit Entry" : "Daily Check-in"}
        </h2>

        <div className="space-y-6">
          {/* Mood Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              How are you feeling today?
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {moods.map((mood) => (
                <button
                  key={mood}
                  onClick={() => handleMoodSelect(mood)}
                  className={`p-2 rounded transition-colors ${
                    entry.mood === mood
                      ? "bg-blue-600 text-white"
                      : "bg-white/80 border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          {/* Trigger Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Are you experiencing any triggers?
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {commonTriggers.map((trigger) => (
                <button
                  key={trigger}
                  onClick={() => handleTriggerToggle(trigger)}
                  className={`p-2 rounded transition-colors ${
                    entry.triggers.includes(trigger)
                      ? "bg-red-100 text-red-700 border border-red-300"
                      : "bg-white/80 border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {trigger}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Additional Notes
            </h3>
            <textarea
              value={entry.notes}
              onChange={handleNotesChange}
              className="w-full h-32 p-4 bg-white/80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
              placeholder="How are you feeling? What are your goals for today? Any challenges you're facing?"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              {editingIndex !== null ? "Update Entry" : "Save Entry"}
            </button>
            {editingIndex !== null && (
              <button
                onClick={handleCancelEdit}
                className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Previous Entries */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-700 mb-4">
          Previous Entries
        </h3>
        <div className="h-[300px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {entries.map((entry, index) => (
            <div
              key={entry._id || index}
              className="border border-gray-200 rounded-lg p-4 bg-white/80"
            >
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-gray-500">
                  {new Date(entry.date).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="font-medium text-blue-600">{entry.mood}</p>
              {entry.triggers.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Triggers:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {entry.triggers.map((trigger) => (
                      <span
                        key={trigger}
                        className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm"
                      >
                        {trigger}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {entry.notes && (
                <p className="mt-2 text-gray-700">{entry.notes}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
