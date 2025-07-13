import { connectDB } from "../lib/db";
import { MongoServerError } from "mongodb";

async function testConnection() {
  try {
    console.log("Checking environment variables...");
    // Hide sensitive parts of the connection string
    const connectionString = process.env.MONGODB_URI || "";
    const maskedString = connectionString.replace(
      /mongodb\+srv:\/\/([^:]+):([^@]+)@/,
      "mongodb+srv://[USERNAME]:[PASSWORD]@"
    );
    console.log("Connection string format:", maskedString);

    console.log("\nAttempting to connect to MongoDB...");
    const mongoose = await connectDB();
    console.log("Successfully connected to MongoDB!");
    console.log("Connection state:", mongoose.connection.readyState);
    console.log("Database name:", mongoose.connection.name);

    // Create a test model
    const TestSchema = new mongoose.Schema({
      name: String,
      createdAt: { type: Date, default: Date.now },
    });
    const Test = mongoose.models.Test || mongoose.model("Test", TestSchema);

    // Create a test document
    console.log("\nCreating test document...");
    const testDoc = await Test.create({ name: "Test Document" });
    console.log("Created document:", testDoc);

    // Read all documents
    console.log("\nReading all documents...");
    const allDocs = await Test.find({});
    console.log("All documents:", allDocs);

    process.exit(0);
  } catch (error) {
    console.error("Failed:", error);
    if (error instanceof MongoServerError) {
      console.log("\nTroubleshooting tips:");
      console.log("1. Check if username and password are correct");
      console.log(
        "2. Verify that the IP address is whitelisted in MongoDB Atlas"
      );
      console.log("3. Ensure the user has the correct database permissions");
      console.log(
        "4. Check if special characters in password are properly URL encoded"
      );
    }
    process.exit(1);
  }
}

testConnection();
