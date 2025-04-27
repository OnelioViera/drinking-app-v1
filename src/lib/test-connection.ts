import { connectDB } from "./db";

// Set environment variable directly for testing
process.env.MONGODB_URI =
  "mongodb+srv://ojvwebdesign:Daniel2025@cluster0.xwkg5pu.mongodb.net/drinking?retryWrites=true&w=majority&appName=Cluster0";

async function testConnection() {
  try {
    const mongoose = await connectDB();
    console.log("Database connection test successful!");
    console.log("Connection state:", mongoose.connection.readyState);
    console.log("Database name:", mongoose.connection.name);
    process.exit(0);
  } catch (error) {
    console.error("Database connection test failed:", error);
    process.exit(1);
  }
}

testConnection();
