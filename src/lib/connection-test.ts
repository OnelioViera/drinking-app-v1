import mongoose from "mongoose";

const MONGODB_URI =
  "mongodb+srv://ojvwebdesign:Daniel2025@cluster0.xwkg5pu.mongodb.net/drinking?retryWrites=true&w=majority&appName=Cluster0";

async function testConnection() {
  try {
    console.log("Attempting to connect to MongoDB...");
    const connection = await mongoose.connect(MONGODB_URI);
    console.log("Successfully connected to MongoDB!");
    console.log("Database name:", connection.connection.name);
    console.log("Connection state:", connection.connection.readyState);
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

testConnection();
