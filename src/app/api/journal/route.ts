import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import JournalEntry from "@/models/JournalEntry";

export async function POST(request: Request) {
  try {
    console.log("Attempting to save journal entry...");
    await connectDB();
    const body = await request.json();
    console.log("Received data:", body);
    const journalEntry = await JournalEntry.create(body);
    console.log("Saved entry:", journalEntry);
    return NextResponse.json(journalEntry, { status: 201 });
  } catch (error) {
    console.error("Failed to save journal entry:", error);
    return NextResponse.json(
      { error: "Failed to save journal entry" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log("Attempting to fetch journal entries...");
    await connectDB();
    const entries = await JournalEntry.find({}).sort({ date: -1 });
    console.log("Found entries:", entries);
    return NextResponse.json(entries);
  } catch (error) {
    console.error("Failed to fetch journal entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch journal entries" },
      { status: 500 }
    );
  }
}
