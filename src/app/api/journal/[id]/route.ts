import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import JournalEntry from "@/models/JournalEntry";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const updatedEntry = await JournalEntry.findByIdAndUpdate(
      params.id,
      { deleted: true },
      { new: true }
    );

    if (!updatedEntry) {
      return NextResponse.json(
        { error: "Journal entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Journal entry marked as deleted" });
  } catch (error) {
    console.error("Failed to mark journal entry as deleted:", error);
    return NextResponse.json(
      { error: "Failed to mark journal entry as deleted" },
      { status: 500 }
    );
  }
}
