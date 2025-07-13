import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    console.log("Testing database connection...");
    const db = await connectDB();

    // Test if we can actually perform operations
    const collections =
      (await db.connection.db?.listCollections().toArray()) || [];

    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      dbName: db.connection.name,
      connectionState: db.connection.readyState,
      collections: collections.map((c) => c.name),
      environment: {
        hasMongoUri: !!process.env.MONGODB_URI,
        uriLength: process.env.MONGODB_URI?.length || 0,
      },
    });
  } catch (error) {
    console.error("Database connection test failed:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        environment: {
          hasMongoUri: !!process.env.MONGODB_URI,
          uriLength: process.env.MONGODB_URI?.length || 0,
        },
      },
      { status: 500 }
    );
  }
}
