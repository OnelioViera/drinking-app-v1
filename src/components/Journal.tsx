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
  userId?: string;
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
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // Load entries from API on component mount
  useEffect(() => {
    if (!isLoaded || !user) return;

    const loadEntries = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/journal?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          const parsedEntries = data.map(
            (entry: JournalEntry & { _id: string }) => ({
              ...entry,
              date: new Date(entry.date),
            })
          );
          setEntries(parsedEntries);
          onEntriesChange?.(parsedEntries);
        } else {
          console.error("Failed to load entries");
          toast.error("Failed to load journal entries");
        }
      } catch (error) {
        console.error("Error loading entries:", error);
        toast.error("Failed to load journal entries");
      } finally {
        setIsLoading(false);
      }
    };

    loadEntries();
  }, [onEntriesChange, user, isLoaded]);

  // Save entries to API whenever they change
  useEffect(() => {
    if (!isLoaded || !user) return;
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

    if (!user) {
      toast.error("Please sign in to save entries");
      return;
    }

    try {
      setIsLoading(true);

      const entryData = {
        ...entry,
        userId: user.id,
        date: entry.date.toISOString(),
      };

      if (editingIndex !== null) {
        // Update existing entry
        const existingEntry = entries[editingIndex];
        if (existingEntry._id) {
          const response = await fetch(`/api/journal/${existingEntry._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(entryData),
          });

          if (response.ok) {
            const updatedEntry = await response.json();
            const newEntries = [...entries];
            newEntries[editingIndex] = {
              ...updatedEntry,
              date: new Date(updatedEntry.date),
            };
            setEntries(newEntries);
            toast.success("Journal entry updated!");
            setEditingIndex(null);
          } else {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to update entry");
          }
        }
      } else {
        // Create new entry
        const response = await fetch("/api/journal", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(entryData),
        });

        if (response.ok) {
          const newEntry = await response.json();
          const newEntries = [
            ...entries,
            {
              ...newEntry,
              date: new Date(newEntry.date),
            },
          ];
          setEntries(newEntries);
          toast.success("Journal entry saved!");
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to save entry");
        }
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
      toast.error(
        error instanceof Error ? error.message : "Failed to save journal entry"
      );
    } finally {
      setIsLoading(false);
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

  const handleDelete = async (index: number) => {
    try {
      const entryToDelete = entries[index];
      if (entryToDelete._id) {
        const response = await fetch(`/api/journal/${entryToDelete._id}`, {
          method: "DELETE",
        });

        if (response.ok) {
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
        } else {
          throw new Error("Failed to delete entry");
        }
      } else {
        // Fallback to local deletion if no _id
        const newEntries = entries.filter((_, i) => i !== index);
        setEntries(newEntries);
        toast.success("Entry deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast.error("Failed to delete entry");
    }
  };

  if (isLoading && entries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Loading journal entries...</div>
        </div>
      </div>
    );
  }

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
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? "Saving..."
                : editingIndex !== null
                  ? "Update Entry"
                  : "Save Entry"}
            </button>
            {editingIndex !== null && (
              <button
                onClick={handleCancelEdit}
                disabled={isLoading}
                className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
          {entries.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No journal entries yet. Start by adding your first entry above!
            </div>
          ) : (
            entries.map((entry, index) => (
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
