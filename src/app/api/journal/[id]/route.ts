import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import JournalEntry from "@/models/JournalEntry";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    await connectDB();
    const body = await request.json();

    const updatedEntry = await JournalEntry.findByIdAndUpdate(params.id, body, {
      new: true,
    });

    if (!updatedEntry) {
      return NextResponse.json(
        { error: "Journal entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedEntry);
  } catch (error) {
    console.error("Failed to update journal entry:", error);
    return NextResponse.json(
      { error: "Failed to update journal entry" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    await connectDB();

    const deletedEntry = await JournalEntry.findByIdAndDelete(params.id);

    if (!deletedEntry) {
      return NextResponse.json(
        { error: "Journal entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Journal entry deleted successfully" });
  } catch (error) {
    console.error("Failed to delete journal entry:", error);
    return NextResponse.json(
      { error: "Failed to delete journal entry" },
      { status: 500 }
    );
  }
}
