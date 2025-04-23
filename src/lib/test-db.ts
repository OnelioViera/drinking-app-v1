import connectDB from "./db";

async function testConnection() {
  try {
    console.log("Checking environment variables...");
    console.log(
      "MONGODB_CONNECTION_STRING exists:",
      !!process.env.MONGODB_CONNECTION_STRING
    );

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
    process.exit(1);
  }
}

testConnection();
