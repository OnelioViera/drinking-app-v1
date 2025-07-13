import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import JournalEntry from "@/models/JournalEntry";

export async function POST(request: Request) {
  try {
    console.log("Attempting to save journal entry...");
    await connectDB();
    const body = await request.json();
    console.log("Received data:", body);

    // Ensure the entry has a userId
    if (!body.userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const journalEntry = await JournalEntry.create(body);
    console.log("Saved entry:", journalEntry);
    return NextResponse.json(journalEntry, { status: 201 });
  } catch (error) {
    console.error("Failed to save journal entry:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    console.log("Attempting to fetch journal entries...");
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const entries = await JournalEntry.find({
      userId: userId,
      deleted: { $ne: true },
    }).sort({
      date: -1,
    });
    console.log("Found entries:", entries);
    return NextResponse.json(entries);
  } catch (error) {
    console.error("Failed to fetch journal entries:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
