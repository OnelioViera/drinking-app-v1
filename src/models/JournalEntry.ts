import mongoose from "mongoose";

const journalEntrySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "Please provide a user ID"],
  },
  date: {
    type: Date,
    required: [true, "Please provide a date"],
  },
  mood: {
    type: String,
    required: [true, "Please provide a mood"],
  },
  triggers: [
    {
      type: String,
    },
  ],
  notes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.JournalEntry ||
  mongoose.model("JournalEntry", journalEntrySchema);
