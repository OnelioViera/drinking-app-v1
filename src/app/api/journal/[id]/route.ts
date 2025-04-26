import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import JournalEntry from "@/models/JournalEntry";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function DELETE(request: NextRequest, { params }: RouteContext) {
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
